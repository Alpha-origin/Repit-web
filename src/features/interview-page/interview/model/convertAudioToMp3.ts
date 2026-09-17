import type { Mp3EncoderResult } from "./mp3Encoder.worker";

export const convertAudioToMp3 = async (blob: Blob): Promise<Blob> => {
  const context = new OfflineAudioContext(1, 1, 44_100);
  const decoded = await context.decodeAudioData(await blob.arrayBuffer());
  const channels = Array.from({ length: decoded.numberOfChannels }, (_, index) =>
    decoded.getChannelData(index).slice());

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./mp3Encoder.worker.ts", import.meta.url), {
      type: "module",
    });
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error("MP3 변환 시간이 초과되었습니다."));
    }, 60_000);
    const cleanup = () => {
      window.clearTimeout(timeout);
      worker.terminate();
    };
    worker.onmessage = (event: MessageEvent<Mp3EncoderResult>) => {
      cleanup();
      if ("error" in event.data) reject(new Error(event.data.error));
      else resolve(event.data.blob);
    };
    worker.onerror = () => {
      cleanup();
      reject(new Error("MP3 변환에 실패했습니다."));
    };
    worker.postMessage({ channels, sampleRate: decoded.sampleRate }, channels.map((channel) => channel.buffer));
  });
};
