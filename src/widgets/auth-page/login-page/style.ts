import styled from 'styled-components';

export const Section = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  background-color: #f7fbff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 0 3rem;
  box-sizing: border-box;
  overflow-y: auto;

  @media (max-width: 960px) {
    width: 100%;
    min-height: auto;
    padding: 6rem 0 3rem;
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 24px;
  left: 32px;
  display: flex;
  align-items: center;

  svg {
    display: block;
    width: 80px;
    height: 80px;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const SubmitButton = styled.button`
  width: 100%;
  height: 66px;
  margin-top: 8px;
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

export const LinkWrapper = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LinkText = styled.button`
  border: none;
  background: transparent;
  color: #2478e8;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

export const Divider = styled.span`
  color: #2478e8;
  font-size: 16px;
`;
