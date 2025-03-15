export async function GET() {
  try {
    // Get the base URL from environment variable
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      console.error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: "API base URL not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
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
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      // More detailed error handling
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Request timed out while fetching anime data",
            }),
            {
              status: 504,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Check for specific network errors
        if (error instanceof TypeError) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Network error occurred while fetching anime data",
              details: error.message,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Fallback error handling for other Error instances
        return new Response(
          JSON.stringify({
            success: false,
            message: "An unexpected error occurred while fetching anime data",
            details: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Handle non-Error objects
      return new Response(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred while fetching anime data",
          details: "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: unknown) {
    console.error("Unexpected error in anime data fetch:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred in the API route",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
