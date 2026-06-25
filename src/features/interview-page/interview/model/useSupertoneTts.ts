import { useEffect, useRef, useState } from "react";
import type { QuestionAudioStatus } from "@/widgets/interview-page/interview/type";

const SUPERTONE_TTS_API_URL = "/api/supertone/tts";
const SUPERTONE_ANDREW_VOICE_ID = "4653d63d07d5340656b6bc";
const SUPERTONE_DEFAULT_MODEL = "sona_speech_1";
const SUPERTONE_DEFAULT_LANGUAGE = "ko";
const SUPERTONE_DEFAULT_SPEED = 1.15;

const createSpeechRequest = (text: string) =>
  JSON.stringify({
    text,
    language: SUPERTONE_DEFAULT_LANGUAGE,
    model: SUPERTONE_DEFAULT_MODEL,
    output_format: "wav",
    voice_settings: {
      speed: SUPERTONE_DEFAULT_SPEED,
    },
  });

export const useSupertoneTts = (text: string) => {
  const [status, setStatus] = useState<QuestionAudioStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const releaseAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;
    audioRef.current = null;
  };

  const stop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    releaseAudio();
    clearAudioUrl();
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      releaseAudio();
      clearAudioUrl();
    };
  }, []);

  const play = async () => {
    if (!text.trim() || status === "loading") {
      return;
    }

    stop();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus("loading");

    try {
      const response = await fetch(
        `${SUPERTONE_TTS_API_URL}/${SUPERTONE_ANDREW_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: createSpeechRequest(text),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`Supertone TTS failed with ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;

      audio.onended = () => {
        releaseAudio();
        clearAudioUrl();
        setStatus("idle");
      };

      await audio.play();
      setStatus("playing");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      releaseAudio();
      clearAudioUrl();
      setStatus("idle");
      console.error("Failed to play Supertone TTS.", error);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const toggle = () => {
    if (status === "playing") {
      stop();
      return;
    }

    void play();
  };

  return {
    onPlay: play,
    status,
    onStop: stop,
    onToggle: toggle,
  };
};
