import styled from 'styled-components';

export const Section = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  background-color: #1a73e8;
  overflow: hidden;

  @media (max-width: 960px) {
    width: 100%;
    min-height: 42vh;
  }
`;

export const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: min(27rem, calc(100% - 6rem));
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: clamp(22rem, 34vh, 28rem) 0 0 clamp(4rem, 8vw, 9rem);
  color: #ffffff;

  @media (max-width: 960px) {
    width: calc(100% - 5rem);
    justify-content: flex-end;
    padding: 2.5rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily.calSans};
  font-size: clamp(3.15rem, 4.1vw, 4.35rem);
  line-height: 0.92;
  font-weight: 600;
  letter-spacing: -0.05em;
`;

export const Description = styled.p`
  margin: 1.9rem 0 0;
  font-size: clamp(1.15rem, 1.3vw, 1.45rem);
  font-weight: 700;
  line-height: 1.45;
  white-space: nowrap;
`;

export const SwitchButton = styled.button`
  min-width: 15rem;
  height: 3.85rem;
  margin-top: 2.95rem;
  padding: 0 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.03);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.88);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.35);
    outline-offset: 4px;
  }

  @media (max-width: 960px) {
    min-width: 12rem;
    height: 3.25rem;
    font-size: 1.2rem;
  }
`;
