import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL from the query parameters
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirect') || '/';

    // Add preview=false parameter to the redirect URL to signal the client to exit preview mode
    const url = new URL(redirectUrl, request.url);
    url.searchParams.set('preview', 'false');

    // Create a response that redirects to the specified URL
    const response = NextResponse.redirect(url);

    // Set a cookie to indicate that preview mode is disabled
    response.cookies.set('isPreviewMode', 'false', {
      path: '/',
      maxAge: -1, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Error exiting preview mode:', error);
    return NextResponse.redirect(new URL('/?preview=false', request.url));
  }
}
