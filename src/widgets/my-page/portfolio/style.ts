import styled from "styled-components";

export const PortfolioWrapper = styled.section`
  width: 100%;
  padding: 2.3rem 2.3rem 2rem;
  border-radius: 1.25rem;
  background-color: #ffffff;
  box-shadow: 0 1.1rem 2.8rem rgba(169, 181, 205, 0.14);

  @media (max-width: 48rem) {
    padding: 1.6rem 1.4rem 1.75rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 2.15rem;
  color: #46506a;
  font-size: clamp(2rem, 3vw, 2.35rem);
  font-weight: 800;
  line-height: 1.2;
`;

export const UploadBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 15.7rem;
  border: 1.5px solid #dbe1ea;
  border-radius: 0.95rem;
  background-color: #fdfdfe;
`;

export const GuideBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  background-color: #eef4ff;
  color: #2b3245;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1;

  span {
    color: #397df1;
  }
`;

export const UploadContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.85rem;
  padding: 2.5rem 1.5rem 2rem;
  text-align: center;
`;

export const FileIcon = styled.img`
  width: auto;
  height: clamp(4.9rem, 6vw, 5.9rem);
  display: block;
`;

export const UploadText = styled.p`
  margin: 0;
  color: #50576a;
  font-size: clamp(1.2rem, 2vw, 1.65rem);
  font-weight: 700;
  line-height: 1.45;

  span {
    color: #8a90a2;
  }
`;

export const UploadButton = styled.button`
  border: none;
  border-radius: 0.7rem;
  min-width: 7.6rem;
  height: 2.55rem;
  padding: 0 1.2rem;
  background-color: #323b5a;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

export const InputSection = styled.div`
  margin-top: 2.2rem;
`;

export const Label = styled.h3`
  margin-bottom: 0.9rem;
  color: #46506a;
  font-size: clamp(1.8rem, 2.5vw, 2.2rem);
  font-weight: 800;
  line-height: 1.2;
`;

export const Input = styled.input`
  width: 100%;
  height: 3.45rem;
  padding: 0 1.15rem;
  border: 1px solid #d9dde5;
  border-radius: 0.7rem;
  outline: none;
  color: #47516a;
  font-size: 1rem;
  background-color: #f7f9fd;

  &::placeholder {
    color: #9ea6b9;
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
  height: 3.45rem;
  padding: 0 3.4rem 0 1.15rem;
  border: 1px solid #d9dde5;
  border-radius: 0.7rem;
  outline: none;
  background-color: #f7f9fd;
  color: #47516a;
  font-size: 1rem;
  cursor: pointer;
`;

export const Arrow = styled.span`
  position: absolute;
  top: 50%;
  right: 1.3rem;
  transform: translateY(-50%);
  color: #596076;
  font-size: 1.25rem;
  pointer-events: none;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 4.6rem;

  @media (max-width: 40rem) {
    gap: 1rem;
    margin-top: 3rem;
  }
`;

export const BackButton = styled.button`
  width: min(100%, 18rem);
  min-width: 13rem;
  height: 3.55rem;
  border: none;
  border-radius: 0.85rem;
  background-color: #f1f2f5;
  color: #2f76eb;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #e8ebf2;
    transform: translateY(-1px);
  }
`;

export const SaveButton = styled.button`
  width: min(100%, 18rem);
  min-width: 13rem;
  height: 3.55rem;
  border: none;
  border-radius: 0.85rem;
  background-color: #1976e8;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #0f67d6;
    transform: translateY(-1px);
  }
`;
