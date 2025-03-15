// Remove NextResponse import
// import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    // Get the base URL from environment variables
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
    }

    // Fetch data from the external API using the base URL from .env.local
    const response = await fetch(`${baseUrl}/api/ongoing-anime?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Optional: Add cache configuration
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ongoing anime: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching ongoing anime:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch ongoing anime",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Ensure the route is dynamic
export const dynamic = "force-dynamic";
