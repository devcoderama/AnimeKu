// Remove the NextResponse import
// import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
    }

    // Fetch data from the external API using the base URL from .env.local
    const response = await fetch(`${baseUrl}/api/jadwal-rilis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache configuration
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jadwal rilis anime: ${response.status}`);
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
    console.error("Error fetching jadwal rilis anime:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch jadwal rilis anime",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Ensure the route is dynamic
export const dynamic = "force-dynamic";
