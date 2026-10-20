"""Validate this specification's synthetic fixtures; no third-party modules required.

The schema checker supports exactly the JSON Schema keywords used by the bundled
schema, not the full standard. Server implementations must use their real validators.
"""

from __future__ import annotations

from copy import deepcopy
from decimal import Decimal, ROUND_HALF_UP
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent
KEYS = (
    'faceVisibleRatio', 'headFacingRatio', 'shoulderLevelRatio',
    'upperBodyStableRatio', 'smileShapeRatio',
)
EVENT_METRICS = dict(zip(
    ('FACE_NOT_VISIBLE', 'HEAD_TURNED', 'SHOULDER_TILTED', 'UPPER_BODY_MOVEMENT'), KEYS[:4],
))
ERROR_RETRYABLE = {
    'SOURCE_ACCESS_DENIED_OR_EXPIRED': True, 'SOURCE_DOWNLOAD_FAILED': True,
    'EXTERNAL_SERVICE_UNAVAILABLE': True, 'PROCESSING_TIMEOUT': True,
    'SOURCE_NOT_FOUND': False, 'SOURCE_SIZE_MISMATCH': False,
    'VIDEO_LIMIT_EXCEEDED': False, 'VIDEO_FORMAT_UNSUPPORTED': False,
    'VIDEO_DECODE_FAILED': False, 'INTERNAL_ERROR': False,
    'ANALYZER_NOT_CONFIGURED': False, 'BEHAVIOR_NOT_MEASURABLE': False,
}


def check(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def ratio(n: int, d: int) -> float:
    if not d:
        return 0.0
    return float((Decimal(n)/Decimal(d)).quantize(Decimal('.000001'), rounding=ROUND_HALF_UP))


def type_matches(value: object, kind: str) -> bool:
    return {
        'object': isinstance(value, dict), 'array': isinstance(value, list),
        'string': isinstance(value, str), 'boolean': isinstance(value, bool),
        'integer': isinstance(value, int) and not isinstance(value, bool),
        'number': isinstance(value, (int, float)) and not isinstance(value, bool),
        'null': value is None,
    }[kind]


def schema_check(value: object, rule: dict, schema: dict, path: str = '$') -> None:
    known = {
        '$schema', '$id', '$defs', '$ref', '$comment', 'title', 'type', 'const',
        'enum', 'minimum', 'maximum', 'minLength', 'maxLength', 'properties',
        'required', 'additionalProperties', 'items', 'minItems', 'maxItems',
        'uniqueItems', 'allOf', 'if', 'then', 'else',
    }
    check(set(rule) <= known, f'{path}: unsupported schema keyword')
    if '$ref' in rule:
        target = schema
        for part in rule['$ref'].removeprefix('#/').split('/'):
            target = target[part]
        schema_check(value, target, schema, path)
    if 'type' in rule:
        kinds = rule['type'] if isinstance(rule['type'], list) else [rule['type']]
        check(any(type_matches(value, kind) for kind in kinds), f'{path}: type')
    if 'const' in rule:
        check(value == rule['const'], f'{path}: const')
    if 'enum' in rule:
        check(value in rule['enum'], f'{path}: enum')
    if isinstance(value, (float, int)) and not isinstance(value, bool):
        check(math.isfinite(value), f'{path}: finite')
        check(value >= rule.get('minimum', -math.inf), f'{path}: minimum')
        check(value <= rule.get('maximum', math.inf), f'{path}: maximum')
    if isinstance(value, str):
        check(len(value) >= rule.get('minLength', 0), f'{path}: minLength')
        check(len(value) <= rule.get('maxLength', math.inf), f'{path}: maxLength')
    if isinstance(value, dict):
        check(set(rule.get('required', [])) <= set(value), f'{path}: required')
        properties = rule.get('properties', {})
        if rule.get('additionalProperties') is False:
            check(set(value) <= set(properties), f'{path}: extra properties')
        for key in value.keys() & properties.keys():
            schema_check(value[key], properties[key], schema, f'{path}.{key}')
    if isinstance(value, list):
        check(len(value) >= rule.get('minItems', 0), f'{path}: minItems')
        check(len(value) <= rule.get('maxItems', math.inf), f'{path}: maxItems')
        if rule.get('uniqueItems'):
            check(len({json.dumps(x, sort_keys=True) for x in value}) == len(value), f'{path}: unique')
        if 'items' in rule:
            for i, item in enumerate(value):
                schema_check(item, rule['items'], schema, f'{path}[{i}]')
    for child in rule.get('allOf', []):
        schema_check(value, child, schema, path)
    if 'if' in rule:
        try:
            schema_check(value, rule['if'], schema, path)
        except ValueError:
            branch = 'else'
        else:
            branch = 'then'
        if branch in rule:
            schema_check(value, rule[branch], schema, path)


def validate_behavior(data: dict, schema: dict) -> str:
    schema_check(data, schema, schema)
    duration = data['durationMs']
    count, sampled = data['sampledFrameCount'], data['sampledDurationMs']
    check(count <= math.ceil(duration/200), 'sample count')
    check(0 <= sampled <= duration, 'sampled duration')
    check((count == 0) == (sampled == 0), 'count/duration zero mismatch')
    check(sampled <= count*200 and sampled >= max(0, (count-1)*200), 'slot weight')
    available = []
    face_time = data['metrics']['faceVisibleRatio']['numeratorMs']
    for key in KEYS:
        m = data['metrics'][key]
        n, d = m['numeratorMs'], m['denominatorMs']
        check(0 <= n <= d <= sampled <= duration, f'{key}: duration bounds')
        if key != KEYS[0]:
            check(d <= face_time, f'{key}: single-face bounds')
        check(abs(m['coverageRatio']-ratio(d,duration)) <= .000001, f'{key}: coverage')
        should_available = duration >= 10000 and d >= 10000 and d/duration >= .30
        check((m['status'] == 'AVAILABLE') == should_available, f'{key}: status')
        if should_available:
            check(abs(m['value']-ratio(n,d)) <= .000001, f'{key}: value')
            available.append(key)
        elif duration < 10000:
            check(m['unavailableReason'] == 'INSUFFICIENT_DURATION', f'{key}: reason')
        else:
            reason = 'LOW_COVERAGE'
            if key != KEYS[0] and face_time == 0:
                reason = 'NO_SINGLE_FACE'
            elif d == 0:
                reason = {
                    KEYS[1]: 'HEAD_POSE_UNAVAILABLE', KEYS[2]: 'SHOULDERS_NOT_VISIBLE',
                    KEYS[3]: 'SHOULDERS_NOT_VISIBLE', KEYS[4]: 'BLENDSHAPES_UNAVAILABLE',
                }.get(key, 'LOW_COVERAGE')
            check(m['unavailableReason'] == reason, f'{key}: reason')
    check(available, 'success needs at least one available metric')
    bins = data['timeline']
    width = max(10000, math.ceil(duration/60000)*1000)
    check(len(bins) == math.ceil(duration/width), 'bin count')
    for i, b in enumerate(bins):
        check(b['startMs'] == i*width and b['endMs'] == min((i+1)*width,duration), 'bin boundaries')
        for key, pair in b['metrics'].items():
            check(0 <= pair['numeratorMs'] <= pair['denominatorMs'] <= b['endMs']-b['startMs'], f'bin {key}: bounds')
    for key in KEYS:
        for field in ('numeratorMs', 'denominatorMs'):
            check(sum(b['metrics'][key][field] for b in bins) == data['metrics'][key][field], f'{key}: bin sum')
    events = data['events']
    check(events == sorted(events, key=lambda x: (x['startMs'], x['type'], x['endMs'])), 'event sort')
    last_end = {}
    for e in events:
        check(e['sourceMetric'] == EVENT_METRICS[e['type']], 'event metric')
        check(e['sourceMetric'] in available, 'event on unavailable metric')
        check(0 <= e['startMs'] < e['endMs'] <= duration, 'event bounds')
        check(e['endMs']-e['startMs'] >= 2000, 'event minimum duration')
        check(last_end.get(e['type'], 0) <= e['startMs'], 'event overlap')
        last_end[e['type']] = e['endMs']
    for b in bins:
        for event_type, key in EVENT_METRICS.items():
            marked = sum(max(0, min(e['endMs'],b['endMs'])-max(e['startMs'],b['startMs'])) for e in events if e['type'] == event_type)
            pair = b['metrics'][key]
            check(marked <= pair['denominatorMs']-pair['numeratorMs'], 'event contradicts bin')
    w = data['warnings']
    check(w == sorted(w), 'warning order')
    check(('EVENTS_TRUNCATED' in w) == data['eventsTruncated'], 'truncation flag')
    check(('LOW_SAMPLE_COVERAGE' in w) == (sampled/duration < .90), 'sample warning')
    check(('LOW_FACE_COVERAGE' in w) == any(data['metrics'][k]['coverageRatio'] < .80 for k in (KEYS[1],KEYS[4])), 'face warning')
    check(('LOW_POSE_COVERAGE' in w) == any(data['metrics'][k]['coverageRatio'] < .80 for k in KEYS[2:4]), 'pose warning')
    ready = len(available) == 5 and all(data['metrics'][k]['denominatorMs']/duration >= .8 for k in KEYS) and sampled/duration >= .90 and 'COMPONENT_FAILURE' not in w
    return 'ready' if ready else 'partial'


def validate_error(error: dict) -> None:
    check(set(error) == {'code', 'message', 'retryable'}, 'error fields')
    check(error['code'] in ERROR_RETRYABLE, 'public error code')
    check(isinstance(error['message'], str) and 0 < len(error['message']) <= 1000, 'public error message')
    check(type(error['retryable']) is bool and error['retryable'] == ERROR_RETRYABLE[error['code']], 'error retryable')


def validate_callback(cb: dict, schema: dict) -> None:
    check(cb['schemaVersion'] == '1', 'outer version')
    for field in ('jobId','requestId','sessionId','interviewId','userId'):
        check(isinstance(cb[field], str) and cb[field], 'callback id')
    status = cb['status']
    if status == 'failed':
        check(cb['result'] is None and cb['error'], 'failed envelope')
        validate_error(cb['error'])
        return
    result, error = cb['result'], cb['error']
    check(error is None and result['status'] == status == result['analysis']['status'], 'callback status')
    a = result['analysis']
    if status in ('ready','partial'):
        check(a['error'] is None and result['error'] is None, 'successful errors')
        check(validate_behavior(a['data'], schema) == status, 'quality status')
        check(a['data']['durationMs'] == result['durationMs'] and a['data']['videoId'] == result['videoId'], 'video binding')
    else:
        check(status == 'unavailable' and a['data'] is None and a['error'], 'unavailable envelope')
        validate_error(a['error'])
        if result['error'] is not None:
            validate_error(result['error'])
            check(result['error'] == a['error'], 'file error consistency')


def validate_api(api: dict, schema: dict) -> None:
    check(set(api) == {'success','data'} and api['success'] is True, 'wrapper')
    a = api['data']
    check(set(a) == {'status','result','canRetry','reasonCode','error','behavior','latestAnalysisId','behaviorAnalysisId','showingPreviousResult'}, 'api fields')
    check(a['status'] in {'NONE','WAITING','ANALYZING','READY','PARTIAL','FAILED'}, 'api status')
    if a['result'] is not None:
        validate_callback(a['result'], schema)
    if a['behavior'] is not None:
        validate_behavior(a['behavior'], schema)
        check(a['behaviorAnalysisId'] is not None, 'behavior id')
    else:
        check(a['behaviorAnalysisId'] is None, 'null behavior id')
    check(a['showingPreviousResult'] == (a['behavior'] is not None and a['latestAnalysisId'] != a['behaviorAnalysisId']), 'previous result')
    if a['status'] in ('NONE','WAITING','ANALYZING','READY'):
        check(not a['canRetry'], 'retry status')


def expect_rejection(callback) -> None:
    try:
        callback()
    except (ValueError, KeyError, TypeError):
        return
    raise ValueError('invalid mutation was accepted')


def main() -> None:
    schema = json.loads((ROOT/'behavior-data.schema.json').read_text())
    fixtures = list(ROOT.glob('*.json'))
    checked = 0
    for path in fixtures:
        if path.name.endswith('.schema.json'):
            continue
        value = json.loads(path.read_text(), parse_constant=lambda _: (_ for _ in ()).throw(ValueError('nonfinite JSON')))
        if path.name.startswith('behavior-'):
            validate_behavior(value, schema)
        elif path.name.startswith('callback-'):
            validate_callback(value, schema)
        else:
            validate_api(value, schema)
        checked += 1
    base = json.loads((ROOT/'behavior-ready.json').read_text())
    mutations = []
    bad = deepcopy(base); bad['metrics']['headFacingRatio']['value'] = .9; mutations.append(bad)
    bad = deepcopy(base); bad['timeline'][0]['metrics']['faceVisibleRatio']['numeratorMs'] = 10001; mutations.append(bad)
    bad = deepcopy(base); bad['events'][0]['sourceMetric'] = 'smileShapeRatio'; mutations.append(bad)
    bad = deepcopy(base); bad['durationMs'] = 4000; mutations.append(bad)
    bad = deepcopy(base); bad['metrics']['faceVisibleRatio']['value'] = None; mutations.append(bad)
    bad = deepcopy(base); bad['extra'] = True; mutations.append(bad)
    bad = deepcopy(base); bad['events'][0]['endMs'] = 13000; mutations.append(bad)
    zero_face = json.loads((ROOT/'behavior-zero-face.json').read_text())
    zero_face['metrics']['headFacingRatio']['unavailableReason'] = 'BLENDSHAPES_UNAVAILABLE'
    mutations.append(zero_face)
    for bad in mutations:
        expect_rejection(lambda: validate_behavior(bad, schema))
    cb = json.loads((ROOT/'callback-ready.json').read_text())
    cb['status'] = 'partial'
    expect_rejection(lambda: validate_callback(cb, schema))
    cb = json.loads((ROOT/'callback-unavailable.json').read_text())
    cb['result']['analysis']['error']['retryable'] = True
    expect_rejection(lambda: validate_callback(cb, schema))
    print(f'PASS: {checked} JSON fixtures, {len(mutations)+2} negative mutations')


if __name__ == '__main__':
    main()
