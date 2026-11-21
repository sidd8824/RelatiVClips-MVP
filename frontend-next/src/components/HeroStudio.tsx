"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  ArrowRight,
  Link2,
  Sparkles,
} from "lucide-react";
import { uploadVideoFile } from "@/lib/api";
import SickLoadingTransition from "./SickLoadingTransition";

import { ImageGallery, type GalleryImage } from "@/components/dimaac/image-gallery";

const images: GalleryImage[] = [
  { src: "https://ui.dimaac.com/media/portraits/tinted-glasses-4x5.jpg", alt: "Woman in purple-tinted sunglasses against an orange glow" },
  { src: "https://ui.dimaac.com/media/portraits/neon-profile-4x5.jpg", alt: "Profile of a woman in neon pink sunglasses on a blue background" },
  { src: "https://ui.dimaac.com/media/fashion/gold-visor-4x5.jpg", alt: "Profile with a gold headpiece on a yellow background" },
  { src: "https://ui.dimaac.com/media/portraits/red-coat-4x5.jpg", alt: "Person in a red coat against deep blue" },
  { src: "https://ui.dimaac.com/media/portraits/lime-blazer-4x5.jpg", alt: "Person in a lime green blazer on a pink background" },
  { src: "https://ui.dimaac.com/media/fashion/orange-visor-4x5.jpg", alt: "Woman in an orange visor on a teal background" },
  { src: "https://ui.dimaac.com/media/fashion/chunky-knit-4x5.jpg", alt: "Model in a chunky knit sweater and coral boots" },
  { src: "https://ui.dimaac.com/media/fashion/purple-hoodie-4x5.jpg", alt: "Person in a purple tie-dye hoodie in a concrete room" },
  { src: "https://ui.dimaac.com/media/portraits/platinum-blonde-4x5.jpg", alt: "Young man with platinum blonde hair in a yellow jacket" },
  { src: "https://ui.dimaac.com/media/fashion/orange-ring-4x5.jpg", alt: "Young man framed through an orange circle" },
];

const ACTION_BUTTON =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dad0ff] motion-safe:transition-[transform,background-color,border-color] motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0";

const ROTATING_PHRASES = [
  "Tasteful Clips",
  "Get More Views",
  "According to your Niche",
  "Hyperpersonalised Clips",
];

export default function HeroStudio() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!url.trim()) {
      setError("Paste a video link or upload a file.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
  };

  const handleUpload = async (file: File) => {
    setUrl("");
    setIsSubmitting(true);
    setError(null);
    try {
      const { taskId } = await uploadVideoFile(file);
      router.push(`/dashboard?taskId=${taskId}`);
    } catch {
      setError("Upload failed. Try pasting a YouTube link instead.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full h-[760px] sm:h-[800px] md:h-[840px] flex items-center justify-center bg-black text-white px-4 overflow-hidden font-sans">
      {/* ── LOWER LAYER: 3D Rotating Card Gallery (overlaps beneath img 2) ── */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
        <ImageGallery
          images={images}
          ringSize={76}
          tileScale={0.9}
          radius={12}
          autoSpin={8}
          pauseOnHover={false}
          className="w-full h-full"
        />
      </div>

      {/* ── UPPER LAYER: img 2 (Main text, subtitle, input bar) ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center space-y-6 pointer-events-none">
        {/* Master Headline (OpusClip exact match) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-col items-center justify-center space-y-3 select-none"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            Turn any footage into
          </h1>

          {/* Rotating Phrase Pill on its own layer above 20x faster */}
          <div className="relative z-20 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            <motion.span
              layout
              transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
              className="relative inline-flex items-center justify-center overflow-hidden px-5 py-1.5 rounded-full bg-black/70 border border-white/25 text-white backdrop-blur-xl h-[1.38em]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={ROTATING_PHRASES[phraseIndex]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block whitespace-nowrap"
                >
                  {ROTATING_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </div>

          {/* 20x faster on the layer below */}
          <div className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            20x faster
          </div>
        </motion.div>

        {/* Subtitle (OpusClip exact match) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
        >
          Paste a link or drop a raw take, and RelatiV clips, edits, sizes and publishes them to all social platforms in one click.
        </motion.p>

        {/* Video source and actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-xl mx-auto pt-2 pointer-events-auto"
        >
          <form
            onSubmit={handleSubmit}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes("Files")) event.preventDefault();
            }}
            onDrop={(event) => {
              const file = event.dataTransfer.files[0];
              if (!file) return;
              event.preventDefault();
              if (isSubmitting) return;
              if (file.type && !file.type.startsWith("video/")) {
                setError("Choose a video file.");
                return;
              }
              void handleUpload(file);
            }}
            className="rounded-[28px] border border-transparent p-3.5 text-left sm:p-5"
            style={{
              background:
                "radial-gradient(ellipse 68% 50px at 50% 0, #dad0ff1c, transparent) padding-box, " +
                "linear-gradient(#18151f, #18151f) padding-box, " +
                "radial-gradient(ellipse 68% 36px at 50% 0, #9688b2, #393448) border-box",
            }}
          >
            <label htmlFor="hero-video-source" className="mb-2 block text-sm font-semibold">
              Video source
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-h-11 min-w-0 flex-[1_1_13rem] items-center gap-2.5 rounded-2xl border border-[#393448] bg-[#100e16] px-3 hover:border-[#73678d] focus-within:outline-2 focus-within:outline-[#dad0ff] motion-safe:transition-colors motion-safe:duration-150">
                <Link2 aria-hidden="true" className="size-4 shrink-0 text-[#b4aec4]" />
                <input
                  id="hero-video-source"
                  type="text"
                  inputMode="url"
                  readOnly={isSubmitting}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Paste a video link"
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent text-base text-white placeholder:text-[#b4aec4] focus:outline-none sm:text-sm"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
                className={`${ACTION_BUTTON} border-[#393448] bg-[#100e16] text-white hover:border-[#73678d] hover:bg-[#242031] disabled:cursor-wait disabled:opacity-60`}
              >
                <UploadCloud aria-hidden="true" className="size-4" />
                Upload file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  if (file && !isSubmitting) void handleUpload(file);
                }}
                hidden
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className={`${ACTION_BUTTON} border-[#393448] bg-[#100e16] text-white hover:border-[#73678d] hover:bg-[#242031]`}
              >
                <Sparkles aria-hidden="true" className="size-4" />
                Auto-edit
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${ACTION_BUTTON} border-transparent bg-[#dad0ff] font-semibold text-[#181126] hover:bg-[#e2d9ff] disabled:cursor-wait disabled:opacity-60`}
              >
                Get free clips
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>

            {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
          </form>
        </motion.div>
      </div>

      {/* Loading transition */}
      {isSubmitting && url && (
        <SickLoadingTransition url={url} autoRedirect={true} />
      )}
    </section>
  );
}
