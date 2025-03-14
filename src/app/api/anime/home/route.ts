import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the base URL from environment variable
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      console.error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
      return NextResponse.json(
        { success: false, message: "API base URL not configured" },
        { status: 500 }
      );
    }

    // Add timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      const response = await fetch(`${baseUrl}/api/home`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          // Add any necessary headers like authorization if required
          // 'Authorization': `Bearer ${process.env.API_TOKEN}`
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `External API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Return the data
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // More detailed error handling
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            message: "Request timed out while fetching anime data",
          },
          { status: 504 } // Gateway Timeout
        );
      }

      // Check for specific network errors
      if (fetchError instanceof TypeError) {
        return NextResponse.json(
          {
            success: false,
            message: "Network error occurred while fetching anime data",
            details: fetchError.message,
          },
          { status: 503 } // Service Unavailable
        );
      }

      // Fallback error handling
      return NextResponse.json(
        {
          success: false,
          message: "An unexpected error occurred while fetching anime data",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in anime data fetch:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the API route",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
