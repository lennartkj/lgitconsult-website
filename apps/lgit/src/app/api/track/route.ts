import { NextRequest, NextResponse } from "next/server";

// First-party funnel event sink. Logs structured events the operator can read
// in server logs (greppable on the `[funnel]` prefix) to see where intent dies
// across the /audit wizard + the gifted-Audit fake-door. Deliberately minimal:
// no store, no PII — swap the body to forward to real analytics when wanted.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = typeof body?.event === "string" ? body.event.slice(0, 64) : "unknown";
    console.log(
      "[funnel]",
      JSON.stringify({
        event,
        props: body?.props ?? null,
        path: typeof body?.path === "string" ? body.path : null,
        ts: new Date().toISOString(),
      })
    );
  } catch {
    // Never fail a tracking call.
  }
  return new NextResponse(null, { status: 204 });
}
