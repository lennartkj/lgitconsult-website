// Client-only image helper shared by the Audit intake. Resizes + recompresses
// in the browser so payloads stay small (a few hundred KB each) and well under
// the serverless body limit — the eye doesn't need full-res originals.

export type UploadedImage = {
  mediaType: "image/jpeg";
  dataBase64: string; // no data: prefix — matches AuditImage in lib/audit/assess.ts
  previewUrl: string; // full data URL, for the thumbnail only
  name: string;
};

export async function compressImage(
  file: File,
  maxDim = 1600,
  quality = 0.82
): Promise<Omit<UploadedImage, "name">> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode failed"));
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(img, 0, 0, width, height);
  const out = canvas.toDataURL("image/jpeg", quality);
  return { mediaType: "image/jpeg", dataBase64: out.split(",")[1] ?? "", previewUrl: out };
}
