import styled from 'styled-components';
import { INTERVIEWER_SELECTION_CARD_SIZE } from '@/shared/constants/interview-page/setting-multi-interview';
import { Section } from '../style';

export const InterviewerSection = styled(Section)`
  margin-top: auto;
`;

export const CardArea = styled.div`
  /* Let the scrollbar sit below the aligned card area. */
  height: ${INTERVIEWER_SELECTION_CARD_SIZE.height};
  flex-shrink: 0;
`;
