import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  padding: clamp(1rem, 2.5vw, 2rem);
  border: 1px solid #dce5f1;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.default};
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const HeadingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  h2 {
    color: #253858;
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: 700;
    letter-spacing: -0.04em;
  }
`;

export const Icon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
`;

export const HeadingIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.875rem;
  height: 2.875rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  svg { width: 1.5rem; height: 1.5rem; }
`;

export const Caption = styled.p`
  color: #69778e;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const Status = styled.p<{ $complete: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $complete }) => $complete ? theme.colors.surface.blueLight : theme.colors.surface.muted};
  color: ${({ theme, $complete }) => $complete ? theme.colors.brand.blue : "#5c6c83"};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  &::before {
    content: "";
    width: 0.375rem;
    height: 0.375rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const Explanation = styled.p`
  color: #69778e;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.65;
`;

export const Badge = styled.p`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: #46658e;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  @media (max-width: 70rem) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 48rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 30rem) { grid-template-columns: 1fr; }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0.625rem;
  padding: 1rem;
  background: #f8faff;
  border: 1px solid #e5edf8;
  border-radius: ${({ theme }) => theme.radius.md};
  h3 {
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    color: #435674;
  }
  @media (max-width: 30rem) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    > div:nth-of-type(n + 2) { grid-column: 1 / -1; }
  }
`;

export const CardHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  svg { color: ${({ theme }) => theme.colors.brand.blue}; }
`;

export const MetricValue = styled.strong<{ $unavailable: boolean }>`
  color: ${({ theme, $unavailable }) => $unavailable ? "#78869c" : theme.colors.brand.blue};
  font-size: ${({ $unavailable }) => $unavailable ? "1.125rem" : "1.75rem"};
  font-weight: 700;
  line-height: 1.2;
  min-height: 2.1rem;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
`;

export const Track = styled.div`
  height: 0.375rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #e1eaf7;
`;

export const Fill = styled.div<{ $ratio: number }>`
  width: ${({ $ratio }) => `${Math.min(1, Math.max(0, $ratio)) * 100}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.blue};
`;

export const Coverage = styled.div`
  margin-top: 0.125rem;
  color: #63738c;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  strong { font-weight: 600; color: #425a7b; }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Button = styled.button`
  min-height: 2.75rem;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.brand.blue};
  border: 1px solid ${({ theme }) => theme.colors.brand.blueLight};
  border-radius: ${({ theme }) => theme.radius.sm};
  font: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surface.blueLight}; }
  &:disabled { opacity: 0.55; cursor: default; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 3px; }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 56rem) { grid-template-columns: 1fr; }
`;

export const Panel = styled.div`
  min-width: 0;
  border: 1px solid #e3e9f2;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.875rem 1rem 0.5rem;
  h3 { color: #354966; font-size: ${({ theme }) => theme.fontSize.sm}; font-weight: 600; }
`;

export const SelectWrap = styled.div`
  position: relative;
  max-width: 100%;
`;

export const SelectChevron = styled.svg`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: #526884;
  pointer-events: none;
`;

export const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  max-width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid #d7e2f1;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: #435674;
  background: ${({ theme }) => theme.colors.white};
  font: inherit;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.5;
  cursor: pointer;
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 2px; }
`;

export const Chart = styled.figure`
  margin: 0;
  padding: 0.75rem 1rem 1rem;
`;

export const ChartPlot = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  height: 6.75rem;
`;

export const ChartScale = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  width: 2rem;
  color: #8390a4;
  font-size: 0.5625rem;
  text-align: right;
`;

export const ChartGraphic = styled.svg`
  display: block;
  width: 100%;
  min-width: 0;
  height: 100%;
`;

export const ChartAxis = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.375rem 0 0 2.5rem;
  color: #78869b;
  font-size: 0.625rem;
  font-variant-numeric: tabular-nums;
`;

export const ChartLegend = styled.figcaption`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.625rem;
  color: #78869b;
  font-size: 0.625rem;
  span { display: flex; align-items: center; gap: 0.375rem; }
  span::before {
    content: "";
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.brand.blue};
  }
  span + span::before { background: #bac6d8; }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: -2px; }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 21rem;
  border-collapse: collapse;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-variant-numeric: tabular-nums;
  caption { padding: 0.75rem 1.25rem; text-align: left; color: #69778e; }
  th, td { padding: 0.75rem 1.25rem; border-bottom: 1px solid #eef1f6; }
  th { white-space: nowrap; font-weight: 500; }
  thead { color: #63738c; background: #f7f9fc; }
  tbody th { color: #5c6c83; }
  tbody td:last-child { color: #69778e; }
  tbody tr:last-child > * { border-bottom: 0; }
  tbody tr:hover { background: #f8faff; }
  @media (max-width: 30rem) { th, td { padding: 0.75rem; } }
`;

export const RatioCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #405b80;
  span { min-width: 3.25rem; }
`;

export const MiniTrack = styled(Track)`
  flex: 1;
  max-width: 6rem;
  min-width: 1.5rem;
  height: 0.25rem;
`;

export const EventList = styled.ul`
  padding: 0 1rem;
  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.625rem;
    padding: 0.75rem 0;
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: #546783;
    & + li { border-top: 1px solid #eef1f6; }
  }
`;

export const TimeBadge = styled.span`
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface.blueLight};
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.6875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const EmptyText = styled.p`
  padding: 1.5rem 1.25rem;
  color: #69778e;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-left: 1rem;
  list-style: disc;
  color: #596f8e;
  font-size: ${({ theme }) => theme.fontSize.xs};
  li::marker { color: ${({ theme }) => theme.colors.brand.blue}; }
`;

export const Notice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Details = styled.details`
  border-top: 1px solid #e3e9f2;
  > summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    padding-top: 0.5rem;
    color: #5c7090;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: 600;
    cursor: pointer;
    list-style: none;
    &::-webkit-details-marker { display: none; }
    &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 2px; }
    svg { position: static; transform: none; }
  }
  &[open] > summary svg { transform: rotate(180deg); }
`;

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.75rem;
`;

export const Definitions = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
  font-size: ${({ theme }) => theme.fontSize.xs};
  dt { margin-bottom: 0.25rem; color: #435674; font-weight: 600; }
  dd { color: #69778e; line-height: 1.7; }
`;

export const Footer = styled.p`
  color: #78869b;
  font-size: 0.6875rem;
`;
