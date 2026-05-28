import styled from "styled-components";

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

  @media (max-width: 60rem) {
    width: 100%;
    min-height: auto;
    padding: 2.5rem 1.5rem 3rem;
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    display: block;
    width: 4rem;
    height: 4rem;
  }

  @media (max-width: 60rem) {
    right: 1.5rem;
  }
`;

export const Panel = styled.div`
  width: min(27rem, calc(100% - 2rem));
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0 0 3rem;
  color: #2478e8;
  font-size: 2.6rem;
  font-weight: 800;
`;

export const Form = styled.form`
  width: min(25.5rem, 100%);
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 3.55rem;
  padding: 0 2.8rem;
  border: 0.0938rem solid #2478e8;
  border-radius: 999rem;
  background-color: transparent;
  color: #2478e8;
  font-size: 1.05rem;
  font-weight: 700;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #2478e8;
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 0 0.1875rem rgba(36, 120, 232, 0.15);
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
    -webkit-box-shadow: 0 0 0 62.5rem #f7fbff inset;
    box-shadow: 0 0 0 62.5rem #f7fbff inset;
    transition: background-color 9999s ease-out;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0.5rem 0 0 1rem;
  color: #ff4d4f;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const StatusMessage = styled.p`
  margin: 0.25rem 0 0 1rem;
  color: #ff4d4f;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 3.3rem;
  margin: 0.5rem 0 0;
  border: none;
  border-radius: 999rem;
  background-color: #2478e8;
  color: #ffffff;
  font-size: 1.15rem;
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

export const LinkWrapper = styled.div`
  margin-top: 1.45rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LinkText = styled.button`
  border: none;
  background: transparent;
  color: #2478e8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

export const Divider = styled.span`
  color: #2478e8;
  font-size: 0.85rem;
`;
