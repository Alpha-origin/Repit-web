import styled from "styled-components";

export const PortfolioWrapper = styled.section`
  width: min(100%, 78rem);

  padding: 2.5rem;
  border-radius: 1.2rem;

  background-color: #ffffff;
`;

export const Title = styled.h2`
  margin: 0 0 2rem;

  color: #3f4658;
  font-size: 2rem;
  font-weight: 800;
`;

export const UploadBox = styled.div`
  position: relative;

  width: 100%;
  height: 17rem;

  border: 2px solid #e4e7ec;
  border-radius: 1rem;

  background-color: #fcfcfd;
`;

export const GuideBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  padding: 0.6rem 1rem;
  border-radius: 0.7rem;

  background-color: #eef4ff;

  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const UploadContent = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FileIcon = styled.div`
  font-size: 4rem;
`;

export const UploadText = styled.p`
  margin: 1rem 0;

  color: #50576a;
  font-size: 1.4rem;
  font-weight: 700;

  span {
    color: #8a90a2;
  }
`;

export const UploadButton = styled.button`
  border: none;
  border-radius: 0.7rem;

  padding: 0.9rem 1.6rem;

  background-color: #323b5a;
  color: #ffffff;

  font-size: 1rem;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const InputSection = styled.div`
  margin-top: 2rem;
`;

export const Label = styled.h3`
  margin-bottom: 0.9rem;

  color: #3f4658;
  font-size: 1.8rem;
  font-weight: 800;
`;

export const Input = styled.input`
  width: 100%;
  height: 4.3rem;

  padding: 0 1.2rem;

  border: 1px solid #d9dde5;
  border-radius: 0.8rem;

  outline: none;

  color: #3f4658;
  font-size: 1rem;

  background-color: #f8f9fc;

  &::placeholder {
    color: #a2a8b7;
  }

  &:focus {
    border-color: #3b82f6;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const Select = styled.select`
  appearance: none;

  width: 100%;
  height: 4.3rem;

  padding: 0 1.2rem;

  border: 1px solid #d9dde5;
  border-radius: 0.8rem;

  outline: none;

  background-color: #f8f9fc;

  color: #3f4658;
  font-size: 1rem;

  cursor: pointer;
`;

export const Arrow = styled.span`
  position: absolute;
  top: 50%;
  right: 1.3rem;

  transform: translateY(-50%);

  color: #687086;
  font-size: 1rem;

  pointer-events: none;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;

  margin-top: 4rem;
`;

export const BackButton = styled.button`
  width: 16rem;
  height: 4.3rem;

  border: none;
  border-radius: 0.9rem;

  background-color: #f1f2f5;
  color: #3b82f6;

  font-size: 1.2rem;
  font-weight: 800;

  cursor: pointer;
`;

export const SaveButton = styled.button`
  width: 16rem;
  height: 4.3rem;

  border: none;
  border-radius: 0.9rem;

  background-color: #1976e8;
  color: #ffffff;

  font-size: 1.2rem;
  font-weight: 800;

  cursor: pointer;

  &:hover {
    background-color: #0f67d6;
  }
`;