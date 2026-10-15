import styled from "styled-components";
import { ActionRow, SecondaryAction } from "../style";

export const Actions = styled(ActionRow)`
  flex-wrap: wrap;
`;

export const LeaveAction = styled(SecondaryAction)`
  width: auto;
  padding: 0.5rem 1rem;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
