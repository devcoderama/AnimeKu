export async function GET(request: Request) {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
    }

    // Ambil slug dari URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    // Hapus "/anime/" dari slug jika ada
    const cleanSlug = slug.replace(/^\/anime\//, "").replace(/\/$/, "");

    // Fetch data from the external API using the base URL
    const response = await fetch(`${baseUrl}/api/anime/${cleanSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      },
      // Add cache configuration
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime details: ${response.status}`);
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
    console.error("Error fetching anime details:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch anime details",
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
