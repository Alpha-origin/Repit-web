import { Mp3Encoder } from "@breezystack/lamejs";

export interface Mp3EncoderInput {
  channels: Float32Array[];
  sampleRate: number;
}

export const encodeMp3 = ({ channels, sampleRate }: Mp3EncoderInput) => {
  const length = channels[0]?.length ?? 0;
  if (!length) throw new Error("녹음된 음성이 없습니다.");
  const encoder = new Mp3Encoder(1, sampleRate, 128);
  const parts: Uint8Array<ArrayBuffer>[] = [];
  for (let offset = 0; offset < length; offset += 1152) {
    const pcm = new Int16Array(Math.min(1152, length - offset));
    for (let index = 0; index < pcm.length; index += 1) {
      const mono = channels.reduce((sum, channel) => sum + channel[offset + index], 0) / channels.length;
      const sample = Math.max(-1, Math.min(1, mono));
      pcm[index] = Math.round(sample * (sample < 0 ? 32768 : 32767));
    }
    const encoded = encoder.encodeBuffer(pcm);
    if (encoded.length) parts.push(new Uint8Array(encoded));
  }
  const tail = encoder.flush();
  if (tail.length) parts.push(new Uint8Array(tail));
  return new Blob(parts, { type: "audio/mpeg" });
};
