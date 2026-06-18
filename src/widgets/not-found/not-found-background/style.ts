import styled from "styled-components";

const notFoundBackground = new URL(
  "../../../shared/img/not-found/404-page.svg",
  import.meta.url,
).href;

export const BackgroundArtwork = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0.08) 100%
    ),
    url(${notFoundBackground});
  background-repeat: no-repeat, no-repeat;
  background-position: center, center;
  background-size: cover, cover;
  opacity: 0.92;

  @media (max-width: 64rem) {
    background-image:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 100%
      ),
      url(${notFoundBackground});
  }
`;
