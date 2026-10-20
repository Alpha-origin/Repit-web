import { useId, useState } from "react";
import { behaviorSummaries, EVENT_MESSAGES, formatVideoDuration, formatVideoPercent, formatVideoTime, UNAVAILABLE_MESSAGES, VIDEO_LABELS, videoStatusMessage, WARNING_MESSAGES } from "@/features/feedback-page/model/feedbackBehavior";
import { VIDEO_METRICS } from "@/features/feedback-page/model/videoAnalysisTypes";
import type { VideoMetricKey } from "@/features/feedback-page/model/videoAnalysisTypes";
import type { BehaviorAnalysisProps } from "./type";
import * as S from "./style";

const BehaviorAnalysis = ({ view, onRefresh, onRetry }: BehaviorAnalysisProps) => {
  const [metric, setMetric] = useState<VideoMetricKey>("faceVisibleRatio");
  const headingId = useId();
  if (!view.visible) return null;
  const { data, notice, busy, uploadStatus } = view;
  const behavior = data?.behavior;
  const statusMessage = uploadStatus === "UPLOADING" ? "면접 영상을 업로드하고 있습니다."
    : uploadStatus === "FAILED" ? "면접 영상 업로드에 실패했습니다. 기존 업로드 알림에서 다시 시도하거나 폐기해 주세요."
      : notice ?? (data ? videoStatusMessage(data) : "영상 행동 관찰 정보를 불러오고 있습니다.");
  return (
    <S.Section aria-labelledby={headingId}>
      <h2 id={headingId}>영상 행동 관찰</h2>
      <S.Explanation>면접 전체 영상에서 관찰한 참고 정보입니다. 0.2초 간격의 추정치이며 질문을 듣거나 기다리는 구간도 포함됩니다. 머리 방향은 실제 눈동자 시선과 다르고, 감정이나 면접 점수를 평가하지 않습니다.</S.Explanation>
      <p role="status" aria-live="polite">{statusMessage}</p>
      {data?.showingPreviousResult ? <S.Badge>{data.status === "ANALYZING" ? "다시 분석 중이며 이전 결과를 표시합니다." : "최근 분석을 완료하지 못해 이전 결과를 표시합니다."}</S.Badge> : null}
      <S.Actions data-html2canvas-ignore="true">
        <S.Button type="button" onClick={onRefresh} disabled={busy}>다시 확인</S.Button>
        {data?.canRetry ? <S.Button type="button" onClick={onRetry} disabled={busy}>{busy ? "요청 중…" : "영상 다시 분석"}</S.Button> : null}
      </S.Actions>
      {behavior ? <>
        <S.Grid>
          {VIDEO_METRICS.map((key) => {
            const m = behavior.metrics[key];
            return <S.Card key={key} aria-label={VIDEO_LABELS[key].title}>
              <h3>{VIDEO_LABELS[key].title}</h3>
              <strong>{m.value === null ? "측정 불가" : formatVideoPercent(m.value)}</strong>
              <S.Explanation>{VIDEO_LABELS[key].description}</S.Explanation>
              {m.unavailableReason ? <p>{UNAVAILABLE_MESSAGES[m.unavailableReason]}</p> : null}
              <S.Explanation>측정 가능 {formatVideoDuration(m.denominatorMs)} / 전체 {formatVideoDuration(behavior.durationMs)} · 관찰 범위 {formatVideoPercent(m.coverageRatio)}</S.Explanation>
            </S.Card>;
          })}
        </S.Grid>
        <S.List aria-label="관찰 안내">{behavior.warnings.map((code) => <li key={code}>{WARNING_MESSAGES[code]}</li>)}</S.List>
        <label>시간 요약 지표
          <S.Select value={metric} onChange={(event) => setMetric(event.target.value as VideoMetricKey)}>
            {VIDEO_METRICS.map((key) => <option key={key} value={key}>{VIDEO_LABELS[key].title}</option>)}
          </S.Select>
        </label>
        {behavior.metrics[metric].status === "UNAVAILABLE" ? <p>이 지표는 측정 불가로 시간별 수치를 제공하지 않습니다.</p> : <S.TableScroll tabIndex={0} role="region" aria-label="시간 요약 표">
          <S.Table>
            <caption>{VIDEO_LABELS[metric].title} 시간 요약</caption>
            <thead><tr><th scope="col">구간</th><th scope="col">관찰 비율</th><th scope="col">관찰 범위</th></tr></thead>
            <tbody>{behavior.timeline.map((bin) => {
              const pair = bin.metrics[metric];
              const coverage = pair.denominatorMs / (bin.endMs - bin.startMs);
              return <tr key={bin.startMs}>
                <th scope="row">{formatVideoTime(bin.startMs)}–{formatVideoTime(bin.endMs, true)}</th>
                <td>{pair.denominatorMs === 0 ? "측정 불가" : coverage < 0.3 ? "관찰 범위 낮음" : formatVideoPercent(pair.numeratorMs / pair.denominatorMs)}</td>
                <td>{formatVideoPercent(coverage)}</td>
              </tr>;
            })}</tbody>
          </S.Table>
        </S.TableScroll>}
        <h3>관찰 구간</h3>
        {behavior.events.length ? <S.List>{behavior.events.map((event) => <li key={`${event.type}-${event.startMs}`}>
          <span aria-label={`${event.startMs}밀리초부터 ${event.endMs}밀리초까지`}>{formatVideoTime(event.startMs)}–{formatVideoTime(event.endMs, true)}</span> {EVENT_MESSAGES[event.type]}
        </li>)}</S.List> : <p>표시 기준을 충족한 관찰 구간이 없습니다.</p>}
        <S.List aria-label="관찰 문장">{behaviorSummaries(behavior).map((line) => <li key={line}>{line}</li>)}</S.List>
        <S.Explanation>모델 {behavior.modelVersion} · 기준 {behavior.thresholdsVersion} · 관찰 구간의 시각은 근사치입니다.</S.Explanation>
      </> : null}
    </S.Section>
  );
};

export default BehaviorAnalysis;
