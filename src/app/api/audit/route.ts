import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// The Audit application schema — mirrors the intake fields in AuditContent.
const auditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  focus: z.array(z.string()).min(1, { message: "Select at least one focus" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  about: z.string().min(10, { message: "Tell us a little more (10+ characters)" }),
  links: z.string().optional().default(""),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "Consent is required" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = auditSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const application = result.data;

    // TODO (Audit loop, next increments):
    //  1. Persist the application (DB / Airtable) — the per-client record.
    //  2. Notify the operator (email) of a new application.
    //  3. Request photos (self / space / current pieces) via a follow-up.
    //  4. Kick off the AI pre-process: vision-tag photos, pull comps, draft a
    //     first-pass assessment against the LGIT taste rubric → operator review queue.
    console.log("Audit application:", application);

    await new Promise((resolve) => setTimeout(resolve, 400));

    return NextResponse.json(
      {
        success: true,
        message: "Application received.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing audit application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "There was an error processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
