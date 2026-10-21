import styled from "styled-components";

export const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  height: calc(100vh - 80px);
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 56.25rem) {
    height: auto;
    min-height: 100dvh;
    padding: 6rem 1.5rem 2rem;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding-top: 4rem;

  @media (max-width: 56.25rem) {
    flex: none;
    width: 100%;
    align-items: center;
    text-align: center;
    padding-top: 0;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 56.25rem) {
    flex: none;
    width: 100%;
  }
`;

export const BrowserImage = styled.img`
  width: 120%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
  margin-top: 6rem;

  @media (max-width: 56.25rem) {
    width: 100%;
    max-width: 28rem;
    margin-top: 0;
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  padding: 0.8rem 1.25rem;
  border-radius: 6.25rem;
  font-size: clamp(0.8rem, 0.75rem + 0.2vw, 0.95rem);
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  color: #155FCA;
  background: linear-gradient(135deg, #F0F6FF 0%, #C1DBFC 63%, #A6CAFA 100%);
  margin-bottom: 1.25rem;
`;

export const Title = styled.h1`
  font-size: clamp(2rem, 1.6rem + 1.2vw, 2.8rem);
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  color: #FFFFFF;
  line-height: 1.2;
  margin: 0;
`;

export const MainTitle = styled.h1`
  font-size: clamp(2.4rem, 2rem + 1.5vw, 3.5rem);
  font-family: ${({ theme }) => theme.fontFamily.wavvePado};
  color: #D4E7FF;
  line-height: 1.2;
  margin: 0.25rem 0 0 0;
`;

export const Subtitle = styled.p`
  margin: 1rem 0 2rem;
  font-size: clamp(0.85rem, 0.8rem + 0.2vw, 1rem);
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  color: #FFFFFF;
  font-weight: 300;
  opacity: 0.9;
  line-height: 1.5;
  word-break: keep-all;
`;

export const StartButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 11.5rem;
  height: 3.2rem;
  padding: 0;
  border-radius: 6.25rem;
  
  background: linear-gradient(135deg, rgba(220, 234, 255, 0.25) 0%, rgba(151, 193, 255, 0.3) 100%);
  color: #FFFFFF;
  
  border: 2px solid rgba(131, 199, 255, 0.5);
  
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  box-shadow: 
    0px 8px 20px rgba(0, 0, 0, 0.25), 
    inset 0px -2px 4px rgba(0, 0, 0, 0.15);
    
  font-size: 1.2rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  letter-spacing: -0.02rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(220, 234, 255, 0.35) 0%, rgba(151, 193, 255, 0.35) 100%);
    border-color: rgba(212, 231, 255, 0.52);
        box-shadow: 
      0px 8px 20px rgba(131, 199, 255, 0.35), 
      inset 0px 1px 4px rgba(255, 255, 255, 0.19),
      inset 0px -2px 4px rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: translateY(-1px);
    box-shadow: 
      0px 6px 16px rgba(131, 199, 255, 0.25), 
      inset 0px 2px 4px rgba(255, 255, 255, 0.4);
  }
`;
