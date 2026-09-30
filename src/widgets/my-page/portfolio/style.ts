import styled from "styled-components";

export const PortfolioWrapper = styled.section`
  width: 100%;
  min-width: 0;
  min-height: 40.625rem;
  padding: 2rem 2rem 0.8rem;
  border: 0.0625rem solid #dce2ec;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.96);

  @media (min-width: 90rem) {
    min-height: 37.375rem;
  }

  @media (max-width: 56rem) {
    min-height: auto;
    padding: 1.6rem 1.5rem 1.4rem;
  }

  @media (max-width: 36rem) {
    padding: 1.3rem 1rem 1.2rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 0.85rem;
  color: #46506a;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 90rem) {
    font-size: 1.125rem;
  }
`;

export const UploadBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 11.4rem;
  overflow: hidden;
  border: 0.0625rem solid #dce1e9;
  border-radius: 0.45rem;
  background-color: #ffffff;

  @media (min-width: 90rem) {
    min-height: 12rem;
  }
`;

export const GuideBadge = styled.div`
  position: absolute;
  top: 0.7rem;
  right: 0.75rem;
  z-index: 1;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  background-color: #eef4ff;
  color: #2f3545;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;

  span {
    color: #397df1;
  }

  @media (max-width: 36rem) {
    font-size: 0.58rem;
  }
`;

export const UploadContent = styled.div`
  min-height: 11.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 2.3rem 1rem 1rem;
  text-align: center;

  @media (min-width: 90rem) {
    min-height: 12rem;
  }
`;

export const FileIcon = styled.img`
  width: auto;
  height: 4.1rem;
  display: block;
  margin-left: 0.4rem;

  @media (min-width: 90rem) {
    height: 4.375rem;
  }
`;

export const UploadText = styled.p`
  margin: 0;
  color: #50576a;
  font-size: 0.83rem;
  font-weight: 550;
  line-height: 1.4;

  span {
    color: #8a90a2;
    font-size: 0.7rem;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const UploadButton = styled.button`
  min-width: 5.3rem;
  height: 1.75rem;
  margin-top: 0.05rem;
  padding: 0 0.85rem;
  border: none;
  border-radius: 0.45rem;
  background-color: #323b5a;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  @media (min-width: 90rem) {
    height: 1.875rem;
  }

  &:hover {
    background-color: #242d4c;
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: 0.15rem;
  }
`;

export const SelectedFileRow = styled.div`
  width: 100%;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.25rem 0.45rem 0.25rem 0.75rem;
  border: 0.0625rem solid #cfd7e3;
  border-radius: 0.45rem;
  background-color: #ffffff;

  @media (min-width: 90rem) {
    min-height: 2.5rem;
  }
`;

export const SelectedFileName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #56617a;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ReplaceFileButton = styled.button`
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: #343c59;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1976e8;
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: 0.15rem;
  }
`;

export const FieldError = styled.p`
  margin: 0.4rem 0 0;
  color: #d64f4f;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.35;
`;

export const InputSection = styled.div`
  margin-top: 1.65rem;

  @media (min-width: 90rem) {
    margin-top: 1.75rem;
  }
`;

export const Label = styled.label`
  display: block;
  margin: 0 0 0.65rem;
  color: #46506a;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 90rem) {
    font-size: 1.125rem;
  }
`;

export const GitInputWrapper = styled.div`
  width: 100%;
  height: 2.25rem;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 0.0625rem solid #d6dce5;
  border-radius: 0.45rem;
  background-color: #f9fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  @media (min-width: 90rem) {
    height: 2.5rem;
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.14rem rgba(59, 130, 246, 0.12);
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 0.8rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: #47516a;
  font-size: 0.75rem;

  &::placeholder {
    color: #8d98ad;
  }
`;

export const GitAddButton = styled.button`
  width: 2.25rem;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: #46506a;
  font-size: 1.45rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    color: #1976e8;
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: -0.2rem;
  }

  &:disabled {
    cursor: default;
    opacity: 0.45;
  }
`;

export const GitUrlList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 0.65rem;
`;

export const GitUrlRow = styled.div`
  width: 100%;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 0.45rem 0 0.8rem;
  border: 0.0625rem solid #cfd7e3;
  border-radius: 0.45rem;
  background-color: #ffffff;

  @media (min-width: 90rem) {
    min-height: 2.5rem;
  }
`;

export const GitUrlText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #7b869c;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GitRemoveButton = styled.button`
  width: 1.7rem;
  height: 1.7rem;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.3rem;
  background-color: transparent;
  color: #596076;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #eef4ff;
    color: #1976e8;
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
  }
`;

export const SaveStatus = styled.p<{ $isError: boolean }>`
  margin: 0.9rem 0 0;
  color: ${({ $isError }) => ($isError ? "#d64f4f" : "#1976e8")};
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: right;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.4rem;
  margin-top: 2.75rem;

  @media (min-width: 90rem) {
    margin-top: 4rem;
  }

  @media (max-width: 36rem) {
    gap: 0.75rem;
    margin-top: 2rem;
  }
`;

export const BackButton = styled.button`
  width: 8rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #f1f2f5;
  color: #2175e6;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  @media (min-width: 90rem) {
    width: 8.5rem;
  }

  &:hover {
    background-color: #e8ebf2;
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: 0.15rem;
  }

  @media (max-width: 36rem) {
    flex: 1;
    min-width: 0;
  }
`;

export const SaveButton = styled.button`
  width: 8rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #1976e8;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  @media (min-width: 90rem) {
    width: 8.5rem;
  }

  &:hover:not(:disabled) {
    background-color: #0f67d6;
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(36, 123, 237, 0.45);
    outline-offset: 0.15rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
  }

  @media (max-width: 36rem) {
    flex: 1;
    min-width: 0;
  }
`;
