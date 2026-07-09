import { useEffect } from "react";
import { api } from "../../services/api";
import { getAdSpec, normalizeAdSizeKey } from "../../utils/constants";
import { resolveMediaUrl } from "../../utils/media";

export default function AdBanner({ ad, placement, className = "" }) {
  useEffect(() => {
    if (ad?.id && ad.id !== "preview") {
      api.adEvent(ad.id, "Impression").catch(() => {});
    }
  }, [ad?.id]);

  if (!ad) return null;

  const slot = placement || ad.position || "Results Inline";
  const sizeKey = normalizeAdSizeKey(slot, ad.size, ad.media);
  const spec = getAdSpec(slot, sizeKey, ad.media);
  const displayWidth = spec.displayMaxW || spec.w;

  const handleClick = () => {
    if (ad.id !== "preview") {
      api.adEvent(ad.id, "Click").catch(() => {});
    }
  };

  const frameStyle = {
    width: "100%",
    maxWidth: `${displayWidth}px`,
    aspectRatio: `${spec.w} / ${spec.h}`,
    ...(spec.h > spec.w ? { maxHeight: "85vh" } : {})
  };

  const mediaSrc = resolveMediaUrl(ad.mediaUrl);
  const isVideo = ad.media === "Video" || mediaSrc?.match(/\.(mp4|webm)$/i);

  const inner = mediaSrc ? (
    isVideo ? (
      <video
        src={mediaSrc}
        className="ad-banner-media"
        width={spec.w}
        height={spec.h}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
    <img
      src={mediaSrc}
      alt={ad.title}
      className="ad-banner-media"
      width={spec.w}
      height={spec.h}
      loading="lazy"
    />
    )
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-teal/5 to-sky-50 px-3 text-center">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wide text-teal">Sponsored</p>
        <p className="text-small mt-0.5 line-clamp-2 font-medium text-ink">{ad.title}</p>
        <p className="text-caption mt-1 text-muted">{spec.label}</p>
      </div>
    </div>
  );

  const frameClass = `ad-frame ${className}`;

  if (ad.targetUrl) {
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={frameClass}
        style={frameStyle}
        aria-label={`Sponsored: ${ad.title}`}
        title={spec.label}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={frameClass} style={frameStyle} title={spec.label}>
      {inner}
    </div>
  );
}
