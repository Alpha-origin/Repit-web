import { useEffect, useState } from "react";

const MIN_DECIBEL = -60;
const MAX_DECIBEL = -15;
const SMOOTHING_FACTOR = 0.24;
// 조용한 환경의 잔음이 게이지를 채우지 않도록 최소 문턱을 둔다.
const NOISE_FLOOR = 0.06;
// 세션 컨텍스트를 통해 내려가는 값이라 매 프레임 갱신하면 화면 전체가 다시 그려진다.
const LEVEL_UPDATE_INTERVAL_MS = 60;
const LEVEL_STEP = 0.04;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeDecibelLevel = (rms: number) => {
  const safeRms = Math.max(rms, 0.0001);
  const decibel = 20 * Math.log10(safeRms);
  const level = clamp((decibel - MIN_DECIBEL) / (MAX_DECIBEL - MIN_DECIBEL), 0, 1);

  return level < NOISE_FLOOR ? 0 : (level - NOISE_FLOOR) / (1 - NOISE_FLOOR);
};

export const useVoiceLevel = (stream: MediaStream | null) => {
  const [voiceLevel, setVoiceLevel] = useState(0);

  useEffect(() => {
    const AudioContextConstructor = window.AudioContext;

    if (!stream || !AudioContextConstructor) {
      return;
    }

    let isCancelled = false;
    let animationFrameId = 0;
    let currentLevel = 0;
    let publishedLevel = 0;
    let lastPublishedAt = 0;
    let audioContext: AudioContext | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let analyserNode: AnalyserNode | null = null;

    const publishLevel = (level: number) => {
      const now = performance.now();

      if (now - lastPublishedAt < LEVEL_UPDATE_INTERVAL_MS) {
        return;
      }

      lastPublishedAt = now;

      const steppedLevel = Math.round(level / LEVEL_STEP) * LEVEL_STEP;

      if (steppedLevel === publishedLevel) {
        return;
      }

      publishedLevel = steppedLevel;
      setVoiceLevel(steppedLevel);
    };

    const startAnalyser = async () => {
      try {
        audioContext = new AudioContextConstructor();

        // 사용자 제스처 없이 생성되면 suspended 상태라 측정값이 항상 0이 된다.
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        if (isCancelled) {
          return;
        }

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.4;

        sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);

        const dataArray = new Uint8Array(analyserNode.fftSize);

        const measureLevel = () => {
          if (!analyserNode || isCancelled) {
            return;
          }

          analyserNode.getByteTimeDomainData(dataArray);

          let sumSquares = 0;

          for (const value of dataArray) {
            const normalizedSample = (value - 128) / 128;
            sumSquares += normalizedSample * normalizedSample;
          }

          const rms = Math.sqrt(sumSquares / dataArray.length);
          const nextLevel = normalizeDecibelLevel(rms);

          currentLevel += (nextLevel - currentLevel) * SMOOTHING_FACTOR;
          publishLevel(currentLevel);
          animationFrameId = window.requestAnimationFrame(measureLevel);
        };

        measureLevel();
      } catch {
        setVoiceLevel(0);
      }
    };

    void startAnalyser();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      sourceNode?.disconnect();
      analyserNode?.disconnect();
      void audioContext?.close();
      setVoiceLevel(0);
    };
  }, [stream]);

  return stream ? voiceLevel : 0;
};
