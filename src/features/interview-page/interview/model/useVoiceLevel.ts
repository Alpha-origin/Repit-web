import { useEffect, useState } from "react";

const MIN_DECIBEL = -60;
const MAX_DECIBEL = -15;
const SMOOTHING_FACTOR = 0.24;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeDecibelLevel = (rms: number) => {
  const safeRms = Math.max(rms, 0.0001);
  const decibel = 20 * Math.log10(safeRms);

  return clamp((decibel - MIN_DECIBEL) / (MAX_DECIBEL - MIN_DECIBEL), 0, 1);
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
    let audioContext: AudioContext | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let analyserNode: AnalyserNode | null = null;

    const startAnalyser = async () => {
      try {
        audioContext = new AudioContextConstructor();
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
          setVoiceLevel(currentLevel);
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
    };
  }, [stream]);

  return stream ? voiceLevel : 0;
};
