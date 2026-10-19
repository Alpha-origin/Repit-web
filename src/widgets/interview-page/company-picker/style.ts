import styled, { css } from "styled-components";
import type { SelectedProps } from "./type";

const focusRing = css`
  &:focus-visible {
    outline: 0.125rem solid rgba(47, 128, 237, 0.34);
    outline-offset: 0.125rem;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
`;

export const SearchField = styled.label`
  flex: 1 1 18rem;
  max-width: 26rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 1rem;
  border: 0.0625rem solid #d5d9e2;
  border-radius: 0.5rem;
  background: #ffffff;
  box-sizing: border-box;

  &:focus-within {
    border-color: #3388f7;
  }

  @media (max-width: 34rem) {
    max-width: none;
  }
`;

export const SearchIcon = styled.span`
  position: relative;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0.2rem 0.2rem 0;
    border: 0.125rem solid #8a8f99;
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0.05rem;
    width: 0.4rem;
    height: 0.125rem;
    background: #8a8f99;
    transform: rotate(45deg);
    transform-origin: right center;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #171717;
  font-family: inherit;
  font-size: 0.95rem;

  &::placeholder {
    color: #a1a6b0;
  }
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Chip = styled.button<SelectedProps>`
  min-height: 2.25rem;
  padding: 0.4rem 0.95rem;
  border: 0.0625rem solid ${({ $selected }) => ($selected ? "#3388f7" : "#d5d9e2")};
  border-radius: 999rem;
  background: ${({ $selected }) => ($selected ? "#eef4ff" : "#ffffff")};
  color: ${({ $selected }) => ($selected ? "#257ee8" : "#3f4450")};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  ${focusRing}
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 64rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 34rem) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.label<SelectedProps>`
  min-width: 0;
  min-height: 9rem;
  position: relative;
  &:focus-within { outline: 0.125rem solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 0.125rem; }
  &:has(input:disabled) { cursor: not-allowed; }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 0.0625rem solid ${({ $selected }) => ($selected ? "#3388f7" : "#d5d9e2")};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? "#eef4ff" : "#ffffff")};
  color: #171717;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:not(:disabled):hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${focusRing}
`;

export const CardTop = styled.span`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  gap: 0.75rem;
`;

export const Badge = styled.span<SelectedProps & { $muted?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 700;
  background: ${({ $selected, $muted }) =>
    $muted ? "#f1f2f4" : $selected ? "#257ee8" : "#eef4ff"};
  color: ${({ $selected, $muted }) =>
    $muted ? "#a1a6b0" : $selected ? "#ffffff" : "#257ee8"};
`;

export const Names = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

export const Name = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SubName = styled.span`
  color: #6b7080;
  font-size: 0.8rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Radio = styled.span<SelectedProps>`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.125rem solid ${({ $selected }) => ($selected ? "#3388f7" : "#c8cbd0")};
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    display: ${({ $selected }) => ($selected ? "block" : "none")};
    left: 0.34rem;
    top: 0.18rem;
    width: 0.36rem;
    height: 0.62rem;
    border: solid #3388f7;
    border-width: 0 0.125rem 0.125rem 0;
    transform: rotate(45deg);
  }
`;

export const CardNote = styled.span`
  color: #6b7080;
  font-size: 0.85rem;
  line-height: 1.5;
`;

export const CardBottom = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Meta = styled.span`
  color: #4d5570;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const TagRow = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const Tags = styled.span`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const Tag = styled.span<SelectedProps>`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  padding: 0.15rem 0.55rem;
  border-radius: 999rem;
  background: ${({ $selected }) => ($selected ? "#ffffff" : "#f4f6fa")};
  color: ${({ $selected }) => ($selected ? "#257ee8" : "#4a4f5c")};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

export const AsOf = styled.span`
  flex-shrink: 0;
  color: #a1a6b0;
  font-size: 0.72rem;
  white-space: nowrap;
`;

export const Empty = styled.p`
  margin: 0;
  align-self: center;
  color: #6b7080;
  font-size: 0.95rem;
`;

export const RadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;
