import type {
  InterviewPersonality,
  InterviewTone,
} from "../api/type/create-interview";
import type { InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";
import type { QuestionAudioStatus } from "@/widgets/interview-page/interview/type";
import { useEffect, useRef, useState } from "react";

const ELEVENLABS_TTS_API_URL = "/api/elevenlabs/tts";
const ELEVENLABS_VOICES_API_URL = "/api/elevenlabs/voices";
const ELEVENLABS_CONFIGURED_VOICE_ID =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID?.trim();
const ELEVENLABS_ENV = import.meta.env as Record<string, string | undefined>;
const ELEVENLABS_VOICE_NAME = "Kelee K - Seoul Narrator";
const ELEVENLABS_FALLBACK_VOICE_NAME = "Sarah - Mature, Reassuring, Confident";
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";
const ELEVENLABS_SPEECH_SPEED = 1.1;

export interface InterviewerSpeechStyle {
  interviewStyle?: InterviewStyleOption;
  personality?: InterviewPersonality;
  tone?: InterviewTone;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
  use_speaker_boost: boolean;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.1,
  speed: ELEVENLABS_SPEECH_SPEED,
  use_speaker_boost: true,
};

const TONE_PRESETS: Record<
  InterviewTone,
  Pick<VoiceSettings, "stability" | "style" | "speed">
> = {
  GENTLE: { stability: 0.72, style: 0.04, speed: 1.02 },
  DIRECT: { stability: 0.42, style: 0.38, speed: 1.13 },
  // 낮은 안정성 + 강한 style + 빠른 속도로 긴장감과 압박감을 크게 높인다.
  PRESSURING: { stability: 0.2, style: 0.82, speed: 1.17 },
};

const INTERVIEW_STYLE_PRESETS: Record<
  InterviewStyleOption,
  Pick<VoiceSettings, "stability" | "style" | "speed">
> = {
  편함: { stability: 0.74, style: 0.04, speed: 1.02 },
  일반: { stability: 0.55, style: 0.18, speed: 1.1 },
  압박: { stability: 0.05, style: 1, speed: 1.17 },
};

const PERSONALITY_ADJUSTMENTS: Record<
  InterviewPersonality,
  Partial<Pick<VoiceSettings, "stability" | "style" | "speed">>
> = {
  FRIENDLY: { style: -0.04, speed: -0.02 },
  REALISTIC: { style: 0.04 },
  METICULOUS: { stability: 0.04, style: 0.02, speed: -0.01 },
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const TONE_ADJUSTMENTS: Record<
  InterviewTone,
  Partial<Pick<VoiceSettings, "stability" | "style" | "speed">>
> = {
  GENTLE: { stability: 0.04, style: -0.03, speed: -0.02 },
  DIRECT: { stability: -0.04, style: 0.08, speed: 0.02 },
  PRESSURING: { stability: -0.08, style: 0.12, speed: 0.03 },
};

const getVoiceSettings = ({
  interviewStyle,
  personality,
  tone,
}: InterviewerSpeechStyle = {}): VoiceSettings => {
  const basePreset = interviewStyle
    ? INTERVIEW_STYLE_PRESETS[interviewStyle]
    : tone
      ? TONE_PRESETS[tone]
      : DEFAULT_VOICE_SETTINGS;
  const personalityAdjustment = personality
    ? PERSONALITY_ADJUSTMENTS[personality]
    : {};
  const toneAdjustment = tone ? TONE_ADJUSTMENTS[tone] : {};

  return {
    ...DEFAULT_VOICE_SETTINGS,
    stability: clamp(
      basePreset.stability +
        (personalityAdjustment.stability ?? 0) +
        (toneAdjustment.stability ?? 0),
    ),
    style: clamp(
      basePreset.style +
        (personalityAdjustment.style ?? 0) +
        (toneAdjustment.style ?? 0),
    ),
    speed: Math.min(
      1.2,
      Math.max(
        0.8,
        basePreset.speed +
          (personalityAdjustment.speed ?? 0) +
          (toneAdjustment.speed ?? 0),
      ),
    ),
  };
};

const isPlaceholderVoiceId = (voiceId: string | undefined) =>
  !voiceId || voiceId === "Kelee_K_Voice_ID";

const getConfiguredVoiceId = (voiceIndex?: number) => {
  if (voiceIndex !== undefined) {
    const voiceId =
      ELEVENLABS_ENV[`VITE_ELEVENLABS_VOICE_ID${voiceIndex}`]?.trim();

    if (voiceId) {
      return voiceId;
    }
  }

  return ELEVENLABS_CONFIGURED_VOICE_ID;
};

const getVoiceIdFromAccount = async (
  signal: AbortSignal,
  voiceName = ELEVENLABS_VOICE_NAME,
) => {
  // ElevenLabs의 search 파라미터에 Kelee 이름을 넣으면 다른 음성이 응답에서
  // 제외되므로, 계정 음성 목록 전체에서 지정 음성과 대체 음성을 찾는다.
  const searchParams = new URLSearchParams({ page_size: "100" });
  const response = await fetch(`${ELEVENLABS_VOICES_API_URL}?${searchParams}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs voice list failed with ${response.status}`);
  }

  const payload: unknown = await response.json();
  const voices =
    payload &&
    typeof payload === "object" &&
    "voices" in payload &&
    Array.isArray(payload.voices)
      ? payload.voices
      : [];
  const matchedVoice = voices.find((voice) => {
    if (!voice || typeof voice !== "object") {
      return false;
    }

    return (voice as { name?: unknown }).name === voiceName;
  });

  const voiceId =
    matchedVoice && typeof matchedVoice === "object"
      ? (matchedVoice as { voice_id?: unknown }).voice_id
      : null;

  if (typeof voiceId === "string" && voiceId.trim()) {
    return voiceId.trim();
  }

  if (voiceName !== ELEVENLABS_VOICE_NAME) {
    throw new Error(`ElevenLabs voice not found: ${voiceName}.`);
  }

  const fallbackVoice = voices.find((voice) => {
    if (!voice || typeof voice !== "object") {
      return false;
    }

    return (
      (voice as { name?: unknown }).name === ELEVENLABS_FALLBACK_VOICE_NAME
    );
  });
  const fallbackVoiceId =
    fallbackVoice && typeof fallbackVoice === "object"
      ? (fallbackVoice as { voice_id?: unknown }).voice_id
      : null;

  if (typeof fallbackVoiceId === "string" && fallbackVoiceId.trim()) {
    return fallbackVoiceId.trim();
  }

  throw new Error(
    `ElevenLabs voice not found: ${ELEVENLABS_VOICE_NAME}. Set VITE_ELEVENLABS_VOICE_ID.`,
  );
};

const createSpeechRequest = (text: string, voiceSettings: VoiceSettings) =>
  JSON.stringify({
    text,
    model_id: ELEVENLABS_MODEL_ID,
    voice_settings: voiceSettings,
  });

const requestSpeech = (
  voiceId: string,
  text: string,
  voiceSettings: VoiceSettings,
  signal: AbortSignal,
) =>
  fetch(
    `${ELEVENLABS_TTS_API_URL}/${encodeURIComponent(voiceId)}?output_format=${ELEVENLABS_OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: createSpeechRequest(text, voiceSettings),
      signal,
    },
  );

const isVoiceAccessRestricted = async (response: Response) => {
  if (response.status !== 400) {
    return false;
  }

  const body = await response.clone().text();
  return (
    body.includes("free_users_not_allowed") ||
    body.includes("creator tier or above")
  );
};

export const useElevenLabsTts = (
  text: string,
  voiceIndex?: number,
  speechStyle?: InterviewerSpeechStyle,
) => {
  const [status, setStatus] = useState<QuestionAudioStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const resolvedVoiceIdRef = useRef<string | null>(null);
  const voiceIdRequestRef = useRef<Promise<string> | null>(null);
  const configuredVoiceId = getConfiguredVoiceId(voiceIndex);
  const voiceSettings = getVoiceSettings(speechStyle);

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

  const releaseSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    speechRef.current = null;
  };

  const stop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    releaseAudio();
    releaseSpeech();
    clearAudioUrl();
    setStatus("idle");
  };

  useEffect(() => {
    resolvedVoiceIdRef.current = isPlaceholderVoiceId(configuredVoiceId)
      ? null
      : (configuredVoiceId ?? null);
  }, [configuredVoiceId]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      releaseAudio();
      releaseSpeech();
      clearAudioUrl();
    };
  }, []);

  const playWithBrowserSpeech = (
    speechText: string,
    signal: AbortSignal,
    speechRate = voiceSettings.speed,
  ) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      throw new Error("브라우저 음성 기능을 사용할 수 없습니다.");
    }

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "ko-KR";
      utterance.rate = speechRate;
      speechRef.current = utterance;

      const finish = () => {
        speechRef.current = null;
        setStatus("idle");
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = (event) => {
        speechRef.current = null;

        if (signal.aborted || event.error === "canceled") {
          resolve();
          return;
        }

        setStatus("idle");
        reject(new Error(`브라우저 음성 재생 실패: ${event.error}`));
      };

      signal.addEventListener(
        "abort",
        () => {
          window.speechSynthesis.cancel();
          finish();
        },
        { once: true },
      );

      window.speechSynthesis.speak(utterance);
      setStatus("playing");
    });
  };

  const play = async () => {
    if (!text.trim() || status === "loading") {
      return;
    }

    stop();
    setErrorMessage(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus("loading");

    try {
      if (!resolvedVoiceIdRef.current) {
        if (!isPlaceholderVoiceId(configuredVoiceId)) {
          resolvedVoiceIdRef.current = configuredVoiceId;
        } else {
          const voiceIdRequest =
            voiceIdRequestRef.current ??
            getVoiceIdFromAccount(controller.signal);
          voiceIdRequestRef.current = voiceIdRequest;

          try {
            resolvedVoiceIdRef.current = await voiceIdRequest;
          } catch (error) {
            voiceIdRequestRef.current = null;
            throw error;
          }
        }
      }

      const resolvedVoiceId = resolvedVoiceIdRef.current;
      if (!resolvedVoiceId) {
        throw new Error("ElevenLabs voice ID를 확인할 수 없습니다.");
      }

      let response = await requestSpeech(
        resolvedVoiceId,
        text,
        voiceSettings,
        controller.signal,
      );

      if (
        (await isVoiceAccessRestricted(response)) &&
        resolvedVoiceIdRef.current !== ELEVENLABS_FALLBACK_VOICE_NAME
      ) {
        const fallbackVoiceId = await getVoiceIdFromAccount(
          controller.signal,
          ELEVENLABS_FALLBACK_VOICE_NAME,
        );

        if (fallbackVoiceId !== resolvedVoiceIdRef.current) {
          resolvedVoiceIdRef.current = fallbackVoiceId;
          response = await requestSpeech(
            fallbackVoiceId,
            text,
            voiceSettings,
            controller.signal,
          );
        }
      }

      if (!response.ok) {
        const responseMessage = await response.clone().text();
        console.error("ElevenLabs TTS response error:", {
          status: response.status,
          body: responseMessage,
        });

        if (response.status === 401) {
          setErrorMessage(
            "ElevenLabs 인증에 실패했습니다. API 키와 권한을 확인해주세요.",
          );
          await playWithBrowserSpeech(text, controller.signal);
          return;
        }

        setErrorMessage(
          `ElevenLabs TTS 요청에 실패했습니다. (${response.status})`,
        );
        await playWithBrowserSpeech(text, controller.signal);
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().startsWith("audio/")) {
        setErrorMessage(
          "TTS 응답이 오디오가 아닙니다. 프록시 설정을 확인해주세요.",
        );
        await playWithBrowserSpeech(text, controller.signal);
        return;
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
      if (error instanceof Error && !errorMessage) {
        setErrorMessage(error.message);
      }
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
    errorMessage,
    onStop: stop,
    onToggle: toggle,
  };
};
