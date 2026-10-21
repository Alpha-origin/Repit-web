import styled from "styled-components";

import type { StepDotInnerProps } from "./type";

export const Section = styled.section`
  width: 50%;
  min-height: 42rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem clamp(1.5rem, 4vw, 4rem) 3rem;
  box-sizing: border-box;

  @media (max-width: 60rem) {
    width: 100%;
    min-height: auto;
    padding: 0 1.5rem 3rem;
  }
`;

export const AuthNav = styled.nav`
  position: absolute;
  top: 1.45rem;
  right: 1.75rem;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.875rem;

  @media (max-width: 60rem) {
    top: 1rem;
    right: 1rem;
    gap: 0.875rem;
  }
`;

export const NavTextButton = styled.button`
  background: none;
  border: none;
  color: #3388f7;
  padding: 0.5rem 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #002655;
  }
`;

export const NavPrimaryButton = styled.button`
  background: #3388f7;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  min-height: 2.25rem;
  padding: 0.55rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: #2975d7;
  }
`;

export const Logo = styled.button`
  display: none;
`;

export const Panel = styled.div`
  width: min(24.05rem, 100%);
  min-height: 30.85rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.7rem 3.05rem 4.9rem;
  border-radius: 0.75rem;
  background-color: #fcfaff;
  box-shadow: 0.0625rem 0.9375rem 3.125rem rgba(0, 0, 0, 0.15);

  @media (max-width: 60rem) {
    min-height: auto;
    padding: 3rem 2rem;
  }
`;


export const Title = styled.h2`
  width: 100%;
  margin: 0 0 1.85rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  font-size: 1.55rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;


export const FirstStepLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const SecondStepLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.55rem;
  padding: 0.65rem 0 0;
`;

export const StepFields = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  margin: 0 0 0.55rem;
  color: #000000;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.018rem;
`;

export const FieldBox = styled.div`
  width: 100%;
  height: 2.45rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.75rem;
  border: 0.0625rem solid rgba(186, 186, 186, 0.8);
  border-radius: 0.5rem;
  background-color: transparent;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus-within {
    border-color: rgba(26, 115, 232, 0.58);
    box-shadow: 0 0 0 0.1875rem rgba(26, 115, 232, 0.12);
  }
`;

export const FieldIcon = styled.img`
  width: 0.8rem;
  height: 0.8rem;
  flex: 0 0 auto;
  object-fit: contain;
  opacity: 0.72;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 100%;
  border: none;
  background-color: transparent;
  color: #1f2937;
  font-size: 0.75rem;
  font-weight: 400;
  outline: none;

  &::placeholder {
    color: #767a82;
    opacity: 1;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #1f2937;
    caret-color: #1f2937;
    -webkit-box-shadow: 0 0 0 62.5rem #fcfaff inset;
    box-shadow: 0 0 0 62.5rem #fcfaff inset;
    transition: background-color 9999s ease-out;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0.45rem 0 0 0.2rem;
  color: #ff4d4f;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const StatusMessage = styled.p`
  margin: -0.15rem 0 0 0.2rem;
  color: #ff4d4f;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const NextStepButton = styled.button`
  width: 100%;
  height: 2.55rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.brand.blue};
  color: rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 0.35rem 0.7rem rgba(53, 106, 185, 0.09),
    inset 0 -0.0625rem 0.0625rem rgba(151, 193, 255, 0.4);
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1767d4;
  }
`;

export const ArrowIcon = styled.img`
  display: none;
`;

export const BackStepButton = styled.button`
  display: none;
`;

export const BackArrowIcon = styled.img`
  display: none;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 2.55rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.brand.blue};
  color: rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 0.35rem 0.7rem rgba(53, 106, 185, 0.09),
    inset 0 -0.0625rem 0.0625rem rgba(151, 193, 255, 0.4);
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1767d4;
  }

  &:disabled {
    background-color: #8cb5ef;
    cursor: not-allowed;
  }
`;

export const StepIndicator = styled.div`
  display: none;
`;

export const StepDot = styled.span`
  display: none;
`;

export const StepDotInner = styled.span<StepDotInnerProps>`
  display: none;
`;

export const LinkWrapper = styled.div`
  display: none;
`;

export const LinkText = styled.p`
  display: none;
`;

export const GoLoginButton = styled.button`
  display: none;
`;
