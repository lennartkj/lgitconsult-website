"use client";

import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import { compressImage, type UploadedImage } from "@/components/audit/compressImage";

type Item = {
  piece: string;
  maker?: string;
  model?: string;
  year?: string;
  category: string;
  condition?: string;
  estValue?: string;
  note?: string;
};
type Catalog = { summary: string; items: Item[] };
type Status = "idle" | "submitting" | "done" | "error";

const MAX_IMAGES = 8;
const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-3 text-xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none resize-none";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: easeOut },
};

export default function ProvenanceStart() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imgError, setImgError] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setImgError("");
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setImgError(`Up to ${MAX_IMAGES} photographs.`);
      return;
    }
    const incoming = Array.from(fileList);
    const toAdd = incoming.slice(0, room);
    try {
      const compressed = await Promise.all(toAdd.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed.map((c, i) => ({ ...c, name: toAdd[i].name }))]);
      if (incoming.length > room) setImgError(`Added the first ${room} — up to ${MAX_IMAGES}.`);
    } catch {
      setImgError("Could not read one of those — try a different file.");
    }
  }
  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  async function submit() {
    if (images.length === 0) {
      setImgError("Add at least one photograph.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/provenance/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map(({ mediaType, dataBase64 }) => ({ mediaType, dataBase64 })),
          context,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please try again.");
        return;
      }
      setCatalog(data.catalog as Catalog);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("There was an error. Please try again.");
    }
  }

  return (
    <div className="audit-clinical flex min-h-screen flex-col items-center justify-center bg-bg text-fg px-6 py-16 sm:px-10">
      <div className="w-full max-w-2xl">
        {status === "done" && catalog ? (
          <motion.div {...fade}>
            <span className={labelCls}>Patina · Provenance</span>
            <h1 className="mt-8 text-4xl md:text-6xl font-light tracking-tighter leading-[0.95]">
              The record.
            </h1>
            <p className="mt-8 max-w-xl text-fg/65 text-lg leading-relaxed">{catalog.summary}</p>

            <div className="mt-12 border-t border-fg/15">
              {catalog.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-7 border-b border-fg/10">
                  <div className="col-span-12 md:col-span-1 font-mono text-[11px] text-fg/30 pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <h3 className="text-fg font-medium tracking-tight">{item.piece}</h3>
                    {item.note && <p className="mt-2 text-fg/60 text-sm leading-relaxed">{item.note}</p>}
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40">
                      {[item.maker, item.model, item.year, item.category].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:text-right">
                    {item.estValue && <p className="font-mono text-sm text-fg/70">{item.estValue}</p>}
                    {item.condition && (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40">
                        {item.condition}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-md font-mono text-[11px] uppercase tracking-[0.12em] text-fg/40 leading-relaxed">
              Guidance only — not a certified appraisal. The eye reviews before anything is final.
            </p>
            <div className="mt-10">
              <button
                type="button"
                onClick={() => { setStatus("idle"); setCatalog(null); setImages([]); setContext(""); }}
                className="ac-link font-mono text-[12px] uppercase tracking-[0.15em]"
              >
                ◂ Start another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div {...fade}>
            <span className={labelCls}>Patina · Provenance</span>
            <h1 className="mt-8 text-4xl md:text-6xl font-light tracking-tighter leading-[0.95]">
              Start the record.
            </h1>
            <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
              Photograph the pieces. The eye reads them into a record — what each is,
              roughly what it is worth, what to note. The beginning of knowing what you own.
            </p>

            <div className="mt-12">
              <label className={labelCls}>
                Photographs <span className="text-fg/25">· up to {MAX_IMAGES}</span>
              </label>
              <input
                type="file" accept="image/*" multiple
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                className="mt-4 block w-full text-sm text-fg/50 file:mr-4 file:rounded-none file:border file:border-fg/25 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.1em] file:text-fg/70 hover:file:border-fg/60"
              />
              {imgError && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">{imgError}</p>
              )}
              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden border border-fg/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.previewUrl} alt={img.name} className="h-full w-full object-cover" />
                      <button
                        type="button" onClick={() => removeImage(i)} aria-label="Remove photograph"
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center border border-fg/20 bg-bg/80 text-xs leading-none text-fg"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10">
              <label className={labelCls} htmlFor="ctx">Anything we should know? <span className="text-fg/25">(optional)</span></label>
              <textarea
                id="ctx" rows={2} value={context} onChange={(e) => setContext(e.target.value)}
                className={`${inputCls} mt-4`} placeholder="What this is, where it came from, what matters."
              />
            </div>

            {status === "error" && (
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">{error}</p>
            )}

            <div className="mt-12">
              <button
                type="button" onClick={submit} disabled={status === "submitting"}
                className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4 disabled:opacity-30 disabled:pointer-events-none"
              >
                {status === "submitting" ? "Reading your collection…" : "Catalogue ▸"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
