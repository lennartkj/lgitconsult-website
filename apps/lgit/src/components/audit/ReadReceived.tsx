"use client";

import { useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { track } from "@/lib/track";

const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";

// Clinical confirmation shown after a successful €150 Read payment. Firing
// `read_paid` here (the revenue event), tagged with the `?v=` variant the buyer
// was assigned, makes revenue attributable per ad message — closing the funnel:
//   read_offer_view → read_checkout_click → read_paid.
export default function ReadReceived() {
  useEffect(() => {
    let variant: string | null = null;
    try {
      // Same key the wizard pins the variant under, so revenue ties back to the
      // ad message. (Stripe round-trips the user, but same-origin localStorage
      // persists across the redirect.)
      variant = window.localStorage.getItem("patina_audit_variant");
    } catch {
      /* no localStorage */
    }
    track("read_paid", { variant: variant ?? "unknown" });
  }, []);

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: easeOut },
  };

  return (
    <div className="audit-clinical flex min-h-screen flex-col items-center justify-center bg-bg text-fg px-6 py-16 sm:px-10">
      <div className="w-full max-w-xl">
        <motion.div {...fade}>
          <span className={labelCls}>Patina · In Confidence</span>
          <h1 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">
            Received.
          </h1>
          <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
            Your Read is being prepared. It will reach you within 48 hours,
            privately — a written read of what you own and how it reads, and what
            is worth your attention next.
          </p>
          <p className="mt-6 max-w-md text-fg/55 leading-relaxed">
            The €150 is credited toward an Audit, should you go further.
          </p>
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/30">
            Fewer things. Better ones.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
