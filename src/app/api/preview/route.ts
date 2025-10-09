import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL and secret from the query parameters
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const redirectUrl = searchParams.get('redirect') || '/';

    // Check if the secret is valid
    const expectedSecret = process.env.PREVIEW_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid preview secret' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add preview=true parameter to the redirect URL to signal the client to enter preview mode
    const url = new URL(redirectUrl, request.url);
    url.searchParams.set('preview', 'true');

    // Create a response that redirects to the specified URL
    const response = NextResponse.redirect(url);

    // Set a cookie to indicate that preview mode is enabled
    response.cookies.set('isPreviewMode', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Error entering preview mode:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error entering preview mode' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
