import MainBackground from "@/shared/img/main-page/Main-background.svg?url";
import Vector from "@/shared/img/loading/Vector.png";
import Vector1 from "@/shared/img/loading/Vector1.png";
import Vector2 from "@/shared/img/loading/Vector2.png";
import RepitLogo from "@/shared/img/logo/Repit-logo.svg?url";
import { useEffect, useState } from "react";
import * as S from "./style";

const loadingFrames = [Vector, Vector1, Vector2, Vector1, Vector];

const Loading = () => {
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
        setFrameIndex((currentIndex) => (currentIndex + 1) % loadingFrames.length);
        }, 180);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <S.Container>
        <S.BackgroundImage src={MainBackground} alt="" aria-hidden="true" />
        <S.Header>
            <S.Logo src={RepitLogo} alt="Repit" />
        </S.Header>
        <S.LoadingBox>
            <S.Spinner>
            <S.LoadingImage src={loadingFrames[frameIndex]} alt="" aria-hidden="true" />
            </S.Spinner>
            <S.Text>로딩 중...</S.Text>
        </S.LoadingBox>
        </S.Container>
    );
};

export default Loading;
