import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { catalogCollection, type CatalogImage } from "@/lib/provenance/catalog";
import { rateLimit, clientIp } from "@/lib/ratelimit";

const imageSchema = z.object({
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1),
});

const schema = z.object({
  images: z.array(imageSchema).min(1).max(8),
  context: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  // Strict rate limit — this is an Opus vision call.
  const rl = rateLimit(`provenance:${clientIp(request)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Cataloguing isn't enabled yet." },
        { status: 503 }
      );
    }

    const catalog = await catalogCollection(
      parsed.data.images as CatalogImage[],
      parsed.data.context
    );
    console.log("Provenance catalog produced:", { items: catalog.items.length });
    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    console.error("Provenance cataloguing failed:", error);
    return NextResponse.json(
      { success: false, message: "There was an error cataloguing those photos. Please try again." },
      { status: 500 }
    );
  }
}
