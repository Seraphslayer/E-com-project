import { useRef, useState } from "react";
import { ImagePlus, Film, X, Star, Loader2, Link2 } from "lucide-react";
import { uploadMedia } from "../../store/mediaStore";

const MAX_IMAGE_MB = 15;
const MAX_VIDEO_MB = 50;

interface Props {
  images: string[];
  video: string;
  onImagesChange: (images: string[]) => void;
  onVideoChange: (video: string) => void;
}

export default function MediaUploader({
  images,
  video,
  onImagesChange,
  onVideoChange,
}: Props) {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [linkText, setLinkText] = useState("");

  const addImages = async (files: FileList | File[]) => {
    setError("");
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setError("Please choose image files (JPG, PNG, WebP).");
      return;
    }
    const tooBig = list.find((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is over ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setBusy(true);
    try {
      const urls = await Promise.all(list.map(uploadMedia));
      onImagesChange([...images, ...urls]);
    } catch {
      setError("Could not process that image. Try another file.");
    } finally {
      setBusy(false);
    }
  };

  const addVideo = async (file: File) => {
    setError("");
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file (MP4, WebM).");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Video is over ${MAX_VIDEO_MB} MB. Compress it or paste a link instead.`);
      return;
    }
    setBusy(true);
    try {
      onVideoChange(await uploadMedia(file));
    } catch {
      setError("Could not save that video. Try another file.");
    } finally {
      setBusy(false);
    }
  };

  const addLink = () => {
    const url = linkText.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Paste a full link starting with https://");
      return;
    }
    setError("");
    onImagesChange([...images, url]);
    setLinkText("");
  };

  const makeCover = (i: number) =>
    onImagesChange([images[i], ...images.filter((_, idx) => idx !== i)]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
          Photos
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addImages(e.dataTransfer.files);
          }}
          onClick={() => imageInput.current?.click()}
          className={`border border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-[#D4B63A] bg-[#EACD51]/15"
              : "border-[#E2E2E2] hover:border-[#D4B63A]"
          }`}
        >
          {busy ? (
            <Loader2 size={20} className="mx-auto text-[#6B6B6B] animate-spin" />
          ) : (
            <ImagePlus size={20} className="mx-auto text-[#6B6B6B]" />
          )}
          <p className="font-sans text-sm text-[#0D0D0D] mt-2">
            Drag photos here or click to upload
          </p>
          <p className="font-mono text-[10px] text-[#6B6B6B] mt-1">
            JPG, PNG, WebP up to {MAX_IMAGE_MB} MB each. The first photo is the cover.
          </p>
          <input
            ref={imageInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void addImages(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex-1 flex items-center gap-2 border border-[#E2E2E2] px-3 focus-within:border-[#D4B63A] transition-colors">
            <Link2 size={13} className="text-[#6B6B6B] shrink-0" />
            <input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="Or paste an image link (https://…)"
              className="flex-1 py-2 font-mono text-xs outline-none bg-transparent min-w-0"
            />
          </div>
          <button
            type="button"
            onClick={addLink}
            className="border border-[#E2E2E2] px-3 font-mono text-[11px] tracking-wide hover:border-[#0D0D0D] transition-colors"
          >
            Add
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {images.map((src, i) => (
              <div key={src + i} className="relative group aspect-square bg-[#EBF0F0] overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 bg-[#EACD51] text-[#0D0D0D] font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5">
                    Cover
                  </span>
                )}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i !== 0 && (
                    <button
                      type="button"
                      title="Make cover"
                      onClick={() => makeCover(i)}
                      className="w-6 h-6 bg-white/90 flex items-center justify-center hover:bg-[#EACD51]"
                    >
                      <Star size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => onImagesChange(images.filter((_, idx) => idx !== i))}
                    className="w-6 h-6 bg-white/90 flex items-center justify-center hover:bg-[#FF3B00] hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-1.5">
          Video (optional)
        </label>
        {video ? (
          <div className="relative border border-[#E2E2E2] bg-[#0D0D0D]">
            <video src={video} controls className="w-full max-h-48" />
            <button
              type="button"
              onClick={() => onVideoChange("")}
              className="absolute top-2 right-2 w-6 h-6 bg-white/90 flex items-center justify-center hover:bg-[#FF3B00] hover:text-white"
              title="Remove video"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoInput.current?.click()}
            className="w-full border border-dashed border-[#E2E2E2] hover:border-[#D4B63A] px-4 py-4 flex items-center justify-center gap-2 transition-colors"
          >
            <Film size={16} className="text-[#6B6B6B]" />
            <span className="font-sans text-sm text-[#0D0D0D]">Upload a product video</span>
            <span className="font-mono text-[10px] text-[#6B6B6B]">MP4 / WebM, up to {MAX_VIDEO_MB} MB</span>
          </button>
        )}
        <input
          ref={videoInput}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void addVideo(f);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="font-mono text-[11px] text-[#FF3B00]">{error}</p>}
    </div>
  );
}
