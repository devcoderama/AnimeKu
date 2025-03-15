// Remove NextResponse import
// import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const pathname = url.pathname;

    // Check if this is a list request
    const isList = searchParams.get("list") === "true";

    // Get the base URL from environment variables
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
    }

    // Default endpoint for list
    let endpointUrl = `${baseUrl}/api/season`;

    // Handle list request
    if (isList) {
      endpointUrl = `${baseUrl}/api/season?list=true`;
    }
    // Handle specific season request
    else {
      // Check if we have year and season directly in the query params
      const year = searchParams.get("year");
      const season = searchParams.get("season");

      if (year && season) {
        endpointUrl = `${baseUrl}/api/season?year=${year}&season=${season}`;
      }
      // Check for path parameter pattern /api/season/{season}-{year}
      else {
        const seasonYearMatch = pathname.match(
          /\/api\/season\/(winter|spring|summer|fall)-(\d+)$/
        );
        if (seasonYearMatch) {
          const [, season, year] = seasonYearMatch;
          endpointUrl = `${baseUrl}/api/season?year=${year}&season=${season}`;
        }
      }
    }

    // Fetch data from the external API
    const response = await fetch(endpointUrl, {
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
      throw new Error(`Failed to fetch season anime data: ${response.status}`);
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
    console.error("Error fetching season anime data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch season anime data",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Configure dynamic route handling
export const dynamic = "force-dynamic";
