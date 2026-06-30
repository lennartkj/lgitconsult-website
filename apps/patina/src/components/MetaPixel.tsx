"use client";

import Script from "next/script";

// The Meta (Facebook) base pixel — loaded once from the root layout so the
// Round-1 US ad test can attribute the /audit funnel in Ads Manager. It is
// isolated here (one small client component) so the layout stays clean and the
// whole thing is a single env-gated unit.
//
// Config via env, no hardcoded id: the id is read from NEXT_PUBLIC_META_PIXEL_ID
// (inlined at build because it's NEXT_PUBLIC_*). If it's UNSET, this renders null
// → fbevents.js never loads, `window.fbq` is never defined, and fbqTrack() no-ops
// everywhere. The operator sets the id on the patina Vercel project once their
// Meta account exists; nothing else changes.
//
// EU-consent caveat: this loads WITHOUT a cookie-consent gate. The Round-1 test
// targets the US, so that's acceptable for now — but a consent banner for EU
// visitors is a fast-follow BEFORE any EU/DACH traffic (GDPR/TTDSG). Not built
// here on purpose; gate fbevents.js (and fbqTrack) on consent when it lands.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
