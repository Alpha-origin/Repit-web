import styled from "styled-components";

export const Laptop = styled.div`
  width: min(95%, 29rem);
  justify-self: end;
  align-self: end;
  font-size: clamp(0.25rem, 0.68vw, 0.5rem);
  user-select: none;

  @media (max-width: 42rem) {
    justify-self: center;
    width: min(100%, 23rem);
    font-size: 0.375rem;
  }
`;

export const Screen = styled.div`
  width: 80%;
  aspect-ratio: 1.5;
  margin: 0 auto;
  padding: 0.5em;
  border: 0.8em solid #343b4d;
  border-bottom-width: 1em;
  border-radius: 1.5em 1.5em 0.4em 0.4em;
  display: flex;
  flex-direction: column;
  background: #eef3fc;
  box-shadow: inset 0 0 0 0.25em #ffffff;
  overflow: hidden;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2em;
  min-height: 3em;
  padding: 0.25em 0.5em;
  color: #363c48;
  font-size: 0.75em;

  img { width: 5.5em; height: auto; margin-right: auto; }
`;

export const UserBadge = styled.span`
  margin-left: auto;
  padding: 0.4em 1em;
  border-radius: 0.5em;
  color: #ffffff;
  background: #3388f7;
`;

export const PreviewBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 1em;
  padding: 1em;
`;

export const PreviewCard = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  padding: 0.6em;
  border-radius: 0.6em;
  background: #ffffff;
`;

export const PreviewBanner = styled.div<{ $reversed: boolean }>`
  position: relative;
  min-width: 0;
  order: ${({ $reversed }) => $reversed ? 2 : 0};
  border-radius: 0.4em;
  overflow: hidden;
  color: ${({ $reversed }) => $reversed ? "#ffffff" : "#1877f2"};

  img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  strong { position: absolute; left: 0.7em; bottom: 0.8em; font-size: 1.3em; font-weight: 700; }
`;

export const PreviewDetails = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.4em 0;
`;

export const PreviewBadge = styled.span`
  align-self: flex-end;
  padding: 0.15em 1em;
  border-radius: 2em;
  background: #eef6ff;
  color: #1877f2;
  font-weight: 700;
`;

export const PreviewFeatures = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 0.5em;
  color: #1877f2;
  font-size: 0.8em;
  font-weight: 600;
`;

export const PreviewButton = styled.span`
  padding: 0.5em;
  border-radius: 0.3em;
  background: #1877f2;
  color: #ffffff;
  text-align: center;
  font-size: 0.75em;
`;

export const LaptopBase = styled.div`
  position: relative;
  height: 1.1em;
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  background: linear-gradient(#606979, #303642 70%, #182438);
  box-shadow: 0 0.6em 0.8em rgba(0, 40, 100, 0.18);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 40%;
    width: 20%;
    height: 0.35em;
    border-radius: 0 0 0.5em 0.5em;
    background: #252b38;
  }
`;
