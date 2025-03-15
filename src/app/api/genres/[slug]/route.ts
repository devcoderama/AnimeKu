// src/app/api/genres/[slug]/route.ts

export async function GET(request: Request) {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.ANIME_API_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "ANIME_API_BASE_URL is not defined in environment variables"
      );
    }

    // Ambil parameter page dari URL query
    const url = new URL(request.url);
    const { searchParams, pathname } = url;
    const page = searchParams.get("page") || "1";

    // Dapatkan slug dari pathname URL
    const pathParts = pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    // Fetch data dari API eksternal
    const response = await fetch(`${baseUrl}/api/genres/${slug}?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching genre anime: ${response.status}`);
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
    console.error("Error fetching genre anime:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data anime berdasarkan genre",
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
