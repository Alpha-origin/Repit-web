import styled from "styled-components";

interface StepDotInnerProps {
  $active: boolean;
}

export const Section = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  background-color: #f7fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
  overflow-y: auto;

  @media (max-width: 960px) {
    width: 100%;
    min-height: auto;
    padding: 2.5rem 1.5rem 3rem;
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 24px;
  right: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    display: block;
    width: 80px;
    height: 80px;
  }

  @media (max-width: 960px) {
    right: 24px;
  }
`;

export const Panel = styled.div`
  width: min(500px, calc(100% - 3rem));
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0 0 26px;
  color: #2478e8;
  font-size: 52px;
  font-weight: 800;
`;

export const Form = styled.form`
  width: min(468px, 100%);
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FirstStepLayout = styled.div`
  position: relative;
  width: 100%;
  display: block;

  @media (max-width: 960px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export const SecondStepLayout = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const StepFields = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 66px;
  padding: 0 52px;
  border: 1.5px solid #2478e8;
  border-radius: 999px;
  background-color: transparent;
  color: #2478e8;
  font-size: 20px;
  font-weight: 700;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #2478e8;
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(36, 120, 232, 0.15);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #2478e8;
    caret-color: #2478e8;
    -webkit-box-shadow: 0 0 0 1000px #f7fbff inset;
    box-shadow: 0 0 0 1000px #f7fbff inset;
    transition: background-color 9999s ease-out;
  }
`;

export const ErrorMessage = styled.p`
  margin: 8px 0 0 16px;
  color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
`;

export const StatusMessage = styled.p`
  margin: 4px 0 0 16px;
  color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
`;

export const NextStepButton = styled.button`
  position: absolute;
  top: 50%;
  right: -6rem;
  width: 3.1rem;
  height: 5.6rem;
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%);

  @media (max-width: 960px) {
    position: static;
    width: 3.4rem;
    height: 3.4rem;
    transform: none;
  }
`;

export const ArrowIcon = styled.img`
  width: 2.85rem;
  height: auto;
  display: block;

  @media (max-width: 960px) {
    width: 3rem;
    transform: rotate(90deg);
  }
`;

export const BackStepButton = styled.button`
  position: absolute;
  top: 50%;
  left: -6rem;
  width: 3.1rem;
  height: 5.6rem;
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%);

  @media (max-width: 960px) {
    position: static;
    align-self: center;
    width: 3.4rem;
    height: 3.4rem;
    transform: none;
  }
`;

export const BackArrowIcon = styled.img`
  width: 2.85rem;
  height: auto;
  display: block;
  transform: rotate(180deg);

  @media (max-width: 960px) {
    width: 3rem;
    transform: rotate(-90deg);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 66px;
  border: none;
  border-radius: 999px;
  background-color: #2478e8;
  color: #ffffff;
  font-size: 23px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: #1767d4;
  }

  &:disabled {
    background-color: #8cb5ef;
    cursor: not-allowed;
  }
`;

export const StepIndicator = styled.div`
  width: 2.35rem;
  align-self: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StepDot = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.78rem;
  height: 0.78rem;
  border-radius: 50%;
  border: 1.5px solid #2478e8;
  background: #ffffff;
`;

export const StepDotInner = styled.span<StepDotInnerProps>`
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #2478e8;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: scale(${({ $active }) => ($active ? 1 : 0.45)});
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
`;

export const LinkWrapper = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LinkText = styled.p`
  margin: 0;
  color: #2478e8;
  font-size: 17px;
  font-weight: 600;
`;

export const GoLoginButton = styled.button`
  border: none;
  background: transparent;
  color: #2478e8;
  font-size: 17px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
