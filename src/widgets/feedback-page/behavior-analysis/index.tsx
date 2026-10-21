import { useId, useState } from "react";
import { behaviorSummaries, EVENT_MESSAGES, formatVideoDuration, formatVideoPercent, formatVideoTime, UNAVAILABLE_MESSAGES, VIDEO_LABELS, videoStatusMessage, WARNING_MESSAGES } from "@/features/feedback-page/model/feedbackBehavior";
import { VIDEO_METRICS } from "@/features/feedback-page/model/videoAnalysisTypes";
import type { BehaviorData, VideoMetricKey } from "@/features/feedback-page/model/videoAnalysisTypes";
import type { BehaviorAnalysisProps } from "./type";
import * as S from "./style";

const MetricIcon = ({ metric }: { metric: VideoMetricKey }) => (
  <S.Icon viewBox="0 0 24 24" aria-hidden="true">
    {metric === "faceVisibleRatio" ? <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" /><circle cx="12" cy="10" r="3" /><path d="M7 17c1-4 9-4 10 0" /></> : null}
    {metric === "headFacingRatio" ? <><circle cx="12" cy="12" r="7" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /><circle cx="12" cy="12" r="2" /></> : null}
    {metric === "shoulderLevelRatio" ? <><circle cx="12" cy="6" r="3" /><path d="M3 20v-4l6-3h6l6 3v4M3 12h4m10 0h4M7 17h10" /></> : null}
    {metric === "upperBodyStableRatio" ? <><path d="M3 12h4l3-7 4 14 3-7h4M3 4h3m12 16h3" /></> : null}
    {metric === "smileShapeRatio" ? <><circle cx="12" cy="12" r="9" /><path d="M8 14c2 3 6 3 8 0M8 9h.01M16 9h.01" /></> : null}
  </S.Icon>
);

const BehaviorTimeline = ({ behavior, metric }: { behavior: BehaviorData; metric: VideoMetricKey }) => (
  <S.Chart>
    <S.ChartPlot>
      <S.ChartScale aria-hidden="true"><span>100%</span><span>50%</span><span>0%</span></S.ChartScale>
      <S.ChartGraphic viewBox="0 0 1000 108" preserveAspectRatio="none" role="img" aria-label={`${VIDEO_LABELS[metric].title} 시간대별 그래프. 자세한 값은 상세 수치에서 확인할 수 있습니다.`}>
        {[8, 58, 108].map((y) => <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#e6edf6" strokeDasharray="4 4" />)}
        {behavior.timeline.map((bin) => {
          const pair = bin.metrics[metric];
          const coverage = pair.denominatorMs / (bin.endMs - bin.startMs);
          const measurable = pair.denominatorMs > 0 && coverage >= 0.3;
          const ratio = measurable ? pair.numeratorMs / pair.denominatorMs : 0;
          const width = (bin.endMs - bin.startMs) / behavior.durationMs * 1000;
          const label = pair.denominatorMs === 0 ? "측정 불가" : !measurable ? "관찰 범위 낮음" : formatVideoPercent(ratio);
          const height = measurable ? Math.max(2, ratio * 100) : 6;
          return <rect key={bin.startMs} x={bin.startMs / behavior.durationMs * 1000 + 1} y={108 - height}
            width={Math.max(1, width - 2)} height={height} rx="2" fill={measurable ? "#1877f2" : "#bac6d8"}>
            <title>{formatVideoTime(bin.startMs)}–{formatVideoTime(bin.endMs, true)} · {label} · 관찰 범위 {formatVideoPercent(coverage)}</title>
          </rect>;
        })}
      </S.ChartGraphic>
    </S.ChartPlot>
    <S.ChartAxis aria-hidden="true"><span>00:00</span><span>{formatVideoTime(behavior.durationMs / 2)}</span><span>{formatVideoTime(behavior.durationMs, true)}</span></S.ChartAxis>
    <S.ChartLegend><span>관찰 비율</span><span>관찰 범위 부족</span></S.ChartLegend>
  </S.Chart>
);

const BehaviorAnalysis = ({ view, onRefresh, onRetry }: BehaviorAnalysisProps) => {
  const [metric, setMetric] = useState<VideoMetricKey>("faceVisibleRatio");
  const headingId = useId();
  if (!view.visible) return null;
  const { data, notice, busy, uploadStatus } = view;
  const behavior = data?.behavior;
  const summaries = behavior ? behaviorSummaries(behavior) : [];
  const canRefresh = view.canRefresh || (data?.status === "NONE" && data.reasonCode === "NO_RECORDING");
  const statusMessage = uploadStatus === "UPLOADING" ? "면접 영상을 업로드하고 있습니다."
    : uploadStatus === "FAILED" ? "면접 영상 업로드에 실패했습니다. 기존 업로드 알림에서 다시 시도하거나 폐기해 주세요."
      : notice ?? (data ? videoStatusMessage(data) : "영상 행동 관찰 정보를 불러오고 있습니다.");
  const complete = !notice && !uploadStatus && (data?.status === "READY" || data?.status === "PARTIAL");

  return (
    <S.Section aria-labelledby={headingId}>
      <S.Header>
        <S.HeadingGroup>
          <S.HeadingIcon><MetricIcon metric="faceVisibleRatio" /></S.HeadingIcon>
          <div>
            <h2 id={headingId}>영상 행동 관찰</h2>
            <S.Caption>{behavior ? `전체 영상 ${formatVideoDuration(behavior.durationMs)}에서 살펴본 움직임` : "면접 영상 속 움직임을 확인해 보세요."}</S.Caption>
          </div>
        </S.HeadingGroup>
        <S.Status role="status" aria-live="polite" $complete={complete}>{statusMessage}</S.Status>
      </S.Header>
      {data?.showingPreviousResult ? <S.Badge>{data.status === "ANALYZING" ? "다시 분석 중이며 이전 결과를 표시합니다." : "최근 분석을 완료하지 못해 이전 결과를 표시합니다."}</S.Badge> : null}
      {canRefresh || data?.canRetry ? <S.Actions data-html2canvas-ignore="true">
        {canRefresh ? <S.Button type="button" onClick={onRefresh} disabled={busy}>다시 확인</S.Button> : null}
        {data?.canRetry ? <S.Button type="button" onClick={onRetry} disabled={busy}>{busy ? "요청 중…" : "영상 다시 분석"}</S.Button> : null}
      </S.Actions> : null}
      {behavior ? <S.Grid>
        {VIDEO_METRICS.map((key) => {
          const m = behavior.metrics[key];
          return <S.Card key={key} aria-label={VIDEO_LABELS[key].title}>
            <S.CardHeading><MetricIcon metric={key} /><h3>{VIDEO_LABELS[key].title}</h3></S.CardHeading>
            <S.MetricValue $unavailable={m.value === null}>{m.value === null ? "측정 불가" : formatVideoPercent(m.value)}</S.MetricValue>
            {m.value !== null ? <S.Track aria-hidden="true"><S.Fill $ratio={m.value} /></S.Track> : null}
            <S.Coverage>
              <span>관찰 범위 <strong>{formatVideoPercent(m.coverageRatio)}</strong></span>
            </S.Coverage>
          </S.Card>;
        })}
      </S.Grid> : null}
      <S.Notice>
        <S.Explanation>전체 영상의 관찰 비율이며 면접 점수가 아닙니다. 머리 방향은 실제 시선과 다릅니다.</S.Explanation>
        {behavior?.warnings.length ? <S.List aria-label="관찰 안내">{behavior.warnings.map((code) => <li key={code}>{WARNING_MESSAGES[code]}</li>)}</S.List> : null}
      </S.Notice>
      {behavior ? <>
        <S.DetailGrid>
          <S.Panel>
            <S.PanelHeader>
              <h3>시간대별 관찰</h3>
              <S.SelectWrap>
                <S.Select aria-label="시간 요약 지표" value={metric} onChange={(event) => setMetric(event.target.value as VideoMetricKey)}>
                  {VIDEO_METRICS.map((key) => <option key={key} value={key}>{VIDEO_LABELS[key].title}</option>)}
                </S.Select>
                <S.SelectChevron viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></S.SelectChevron>
              </S.SelectWrap>
            </S.PanelHeader>
            {behavior.metrics[metric].status === "UNAVAILABLE"
              ? <S.EmptyText>이 지표는 측정 불가로 시간별 수치를 제공하지 않습니다.</S.EmptyText>
              : <BehaviorTimeline behavior={behavior} metric={metric} />}
          </S.Panel>
          <S.Panel>
            <S.PanelHeader><h3>관찰 구간</h3><S.Caption>{behavior.events.length}개 구간</S.Caption></S.PanelHeader>
            {behavior.events.length ? <S.EventList>{behavior.events.slice(0, 3).map((event) => <li key={`${event.type}-${event.startMs}`}>
              <S.TimeBadge aria-label={`${event.startMs}밀리초부터 ${event.endMs}밀리초까지`}>{formatVideoTime(event.startMs)}–{formatVideoTime(event.endMs, true)}</S.TimeBadge>
              <span>{EVENT_MESSAGES[event.type]}</span>
            </li>)}</S.EventList> : <S.EmptyText>표시 기준을 충족한 관찰 구간이 없습니다.</S.EmptyText>}
            {behavior.events.length > 3 ? <S.EmptyText>나머지 {behavior.events.length - 3}개 구간은 상세 수치에서 확인하세요.</S.EmptyText> : null}
          </S.Panel>
        </S.DetailGrid>
        <S.Details data-pdf-expand>
          <summary>상세 수치·설명 보기<S.SelectChevron viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></S.SelectChevron></summary>
          <S.DetailContent>
            <S.Definitions>
              {VIDEO_METRICS.map((key) => {
                const m = behavior.metrics[key];
                return <div key={key}>
                  <dt>{VIDEO_LABELS[key].title}</dt>
                  <dd>{VIDEO_LABELS[key].description}</dd>
                  {m.unavailableReason ? <dd>{UNAVAILABLE_MESSAGES[m.unavailableReason]}</dd> : null}
                  <dd>측정 가능 {formatVideoDuration(m.denominatorMs)} / 전체 {formatVideoDuration(behavior.durationMs)} · 관찰 범위 {formatVideoPercent(m.coverageRatio)}</dd>
                </div>;
              })}
            </S.Definitions>
            {behavior.metrics[metric].status !== "UNAVAILABLE" ? <S.TableScroll tabIndex={0} role="region" aria-label="시간 요약 표">
              <S.Table>
                <caption>{VIDEO_LABELS[metric].title} 시간 요약</caption>
                <thead><tr><th scope="col">구간</th><th scope="col">관찰 비율</th><th scope="col">관찰 범위</th></tr></thead>
                <tbody>{behavior.timeline.map((bin) => {
                  const pair = bin.metrics[metric];
                  const coverage = pair.denominatorMs / (bin.endMs - bin.startMs);
                  const measurable = pair.denominatorMs > 0 && coverage >= 0.3;
                  return <tr key={bin.startMs}>
                    <th scope="row">{formatVideoTime(bin.startMs)}–{formatVideoTime(bin.endMs, true)}</th>
                    <td><S.RatioCell>
                      <span>{pair.denominatorMs === 0 ? "측정 불가" : !measurable ? "관찰 범위 낮음" : formatVideoPercent(pair.numeratorMs / pair.denominatorMs)}</span>
                      {measurable ? <S.MiniTrack aria-hidden="true"><S.Fill $ratio={pair.numeratorMs / pair.denominatorMs} /></S.MiniTrack> : null}
                    </S.RatioCell></td>
                    <td>{formatVideoPercent(coverage)}</td>
                  </tr>;
                })}</tbody>
              </S.Table>
            </S.TableScroll> : null}
            {behavior.events.length > 3 ? <S.EventList aria-label="추가 관찰 구간">{behavior.events.slice(3).map((event) => <li key={`${event.type}-${event.startMs}`}>
              <S.TimeBadge aria-label={`${event.startMs}밀리초부터 ${event.endMs}밀리초까지`}>{formatVideoTime(event.startMs)}–{formatVideoTime(event.endMs, true)}</S.TimeBadge>
              <span>{EVENT_MESSAGES[event.type]}</span>
            </li>)}</S.EventList> : null}
            {summaries.length ? <S.List aria-label="관찰 문장">{summaries.map((line) => <li key={line}>{line}</li>)}</S.List> : null}
            <S.Explanation>면접 전체 영상에서 관찰한 참고 정보입니다. 0.2초 간격의 추정치이며 질문을 듣거나 기다리는 구간도 포함됩니다. 머리 방향은 실제 눈동자 시선과 다르고, 감정이나 면접 점수를 평가하지 않습니다.</S.Explanation>
            <S.Footer>모델 {behavior.modelVersion} · 기준 {behavior.thresholdsVersion} · 관찰 구간의 시각은 근사치입니다.</S.Footer>
          </S.DetailContent>
        </S.Details>
      </> : null}
    </S.Section>
  );
};

export default BehaviorAnalysis;
