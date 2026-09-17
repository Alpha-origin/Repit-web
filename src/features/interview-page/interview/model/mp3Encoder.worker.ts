import { encodeMp3 } from "./encodeMp3";
import type { Mp3EncoderInput } from "./encodeMp3";

export type Mp3EncoderResult = { blob: Blob } | { error: string };

self.onmessage = (event: MessageEvent<Mp3EncoderInput>) => {
  try {
    self.postMessage({ blob: encodeMp3(event.data) } satisfies Mp3EncoderResult);
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "MP3 변환에 실패했습니다.",
    } satisfies Mp3EncoderResult);
  }
};
