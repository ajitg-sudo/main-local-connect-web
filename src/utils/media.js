const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || "";

export function resolveMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
  return url;
}

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const MEDIA_ACCEPT = `${IMAGE_ACCEPT},video/mp4,video/webm`;
export const KYC_ACCEPT = `${IMAGE_ACCEPT},application/pdf`;
