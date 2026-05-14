import styled from 'styled-components';

export const Container = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 4px 56px;
  background: linear-gradient(135deg, #eaf2ff 0%, #f2f3f5 38%, #f2f3f5 100%);

  @media (max-width: 640px) {
    padding: 16px 16px 32px;
  }
`;

export const Card = styled.section`
  width: 63rem;
  min-height: 52rem;
  display: flex;
  flex-direction: column;
  padding: 46px 46px 44px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(102, 130, 173, 0.14);

  @media (max-width: 1200px) {
    width: min(1080px, calc(100vw - 56px));
    min-height: 52rem;
    padding: 40px 36px 42px;
  }

  @media (max-width: 900px) {
    width: min(100%, calc(100vw - 40px));
    min-height: auto;
    padding: 32px 28px;
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 24px 20px;
  }
`;

export const Section = styled.div`
  margin-bottom: 54px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Title = styled.h2`
  margin: 0 0 24px;
  color: #4a556f;
  font-size: 28px;
  font-weight: 700;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const OptionButton = styled.button`
  height: 56px;
  border: 1px solid #dfe3ea;
  border-radius: 12px;
  background: #ffffff;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #1f75e8;
    color: #1f75e8;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    height: 50px;
    font-size: 16px;
  }
`;

export const InterviewerList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 6px 10px 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InterviewerCard = styled.button`
  min-height: 220px;
  border: 1px solid #edf1f7;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 14px 28px rgba(31, 117, 232, 0.12);
  color: #333333;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #1f75e8;
    box-shadow: 0 18px 32px rgba(31, 117, 232, 0.16);
  }

  @media (max-width: 640px) {
    min-height: 180px;
  }
`;

export const InterviewerName = styled.strong`
  margin-bottom: 12px;
  font-size: 26px;
  font-weight: 700;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

export const InterviewerTag = styled.span`
  font-size: 22px;
  font-weight: 600;
  line-height: 1.5;

  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: auto;
  padding-top: 36px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const BackButton = styled.button`
  width: 260px;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #f0f0f0;
  color: #0066ff;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 52px;
    font-size: 17px;
  }
`;

export const SaveButton = styled.button`
  width: 260px;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #1f75e8;
  color: #ffffff;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #1668d9;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 52px;
    font-size: 17px;
  }
`;
