import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body against the schema
    const result = contactFormSchema.safeParse(body);

    // If validation fails, return a 400 response with the errors
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    // Extract the validated data
    const { name, email, message } = result.data;

    // In a real application, you would:
    // 1. Send an email notification
    // 2. Store the message in a database
    // 3. Send to a CRM or other external service

    // For now, we'll just log the data and return a success response
    console.log("Contact form submission:", { name, email, message });

    // Simulate a delay to mimic external API calls
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your message. We will get back to you soon!" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);

    // Return a server error response
    return NextResponse.json(
      { 
        success: false, 
        message: "There was an error processing your request. Please try again later." 
      }, 
      { status: 500 }
    );
  }
}
