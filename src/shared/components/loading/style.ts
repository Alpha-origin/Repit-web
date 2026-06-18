import styled, { keyframes } from "styled-components";

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;


export const Container = styled.div`
    position: relative;
    width: 100%;
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    background-color: #f2f3f5;
    box-sizing: border-box;
    overflow: hidden;
`;

export const BackgroundImage = styled.img`
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
`;

export const Header = styled.header`
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 4.25rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    padding: 0 2.5rem;
    margin-top: 0.6rem;
    box-sizing: border-box;

    @media (max-width: 72rem) {
        padding: 0 1.5rem;
    }

    @media (max-width: 56rem) {
        grid-template-columns: 1fr;
        justify-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem 0;
    }
`;

export const Logo = styled.img`
    width: auto;
    height: 3.75rem;
    display: block;
    flex-shrink: 0;
    justify-self: start;
    margin-left: -1rem;

    @media (max-width: 56rem) {
        height: 3.1rem;
        justify-self: center;
        margin-left: 0;
    }
`;

export const LoadingBox = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 0;
    padding-bottom: 4.85rem;
    box-sizing: border-box;
`;

export const Spinner = styled.div`
    position: relative;
    width: 136px;
    height: 136px;
    display: grid;
    place-items: center;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        border: 4px solid rgba(24, 119, 242, 0.16);
        border-top-color: ${({ theme }) => theme.colors.brand.blueAction};
        border-radius: ${({ theme }) => theme.radius.circle};
        animation: ${spin} 0.9s linear infinite;
    }

    @media (max-width: 36rem) {
        width: 108px;
        height: 108px;
    }
`;

export const LoadingImage = styled.img`
    position: relative;
    z-index: 1;
    width: 112px;
    max-width: 82%;
    height: auto;
    max-height: 112px;
    display: block;
    object-fit: contain;

    @media (max-width: 36rem) {
        width: 88px;
        max-height: 88px;
    }
`;

export const Text = styled.p`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text.muted};
`;
