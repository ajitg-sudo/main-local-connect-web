import { resolveMediaUrl } from "../../utils/media";
import FileUpload from "../common/FileUpload";
import { IMAGE_ACCEPT } from "../../utils/media";
import { countBusinessPhotos, maxPhotosForPlan, parseGallery } from "../../utils/planLimits";

export default function BusinessGalleryEditor({ business, galleryUrls = [], logoUrl, onChange }) {
  const plan = business?.premium || "Free";
  const maxPhotos = maxPhotosForPlan(plan);
  const logoCount = logoUrl ? 1 : 0;
  const maxGallery = Math.max(0, maxPhotos - logoCount);
  const gallery = parseGallery(galleryUrls);
  const totalPhotos = countBusinessPhotos({ logoUrl, galleryUrls: gallery });
  const atLimit = totalPhotos >= maxPhotos;

  const addPhoto = (url) => {
    if (!url || gallery.includes(url)) return;
    if (gallery.length >= maxGallery) return;
    onChange([...gallery, url]);
  };

  const removePhoto = (index) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  if (maxGallery === 0) {
    return (
      <div className="rounded-xl border border-line bg-paper px-3 py-2.5">
        <p className="text-label">Photo gallery</p>
        <p className="text-small mt-1 text-muted">
          Your {plan} plan includes 1 photo (logo only). Upgrade to Premium for up to 8 photos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-label">Photo gallery</p>
        <span className="text-caption text-muted">
          {totalPhotos} / {maxPhotos} photos
        </span>
      </div>

      {!!gallery.length && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {gallery.map((url, index) => (
            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg border border-line">
              <img src={resolveMediaUrl(url)} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="text-caption absolute right-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 font-medium text-white"
                onClick={() => removePhoto(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {!atLimit ? (
        <FileUpload
          label="Add gallery photo"
          hint={`JPEG, PNG, or WebP. ${maxGallery - gallery.length} more allowed on ${plan}.`}
          accept={IMAGE_ACCEPT}
          value=""
          onChange={addPhoto}
        />
      ) : (
        <p className="text-small text-muted">Photo limit reached. Upgrade your plan to add more.</p>
      )}
    </div>
  );
}
