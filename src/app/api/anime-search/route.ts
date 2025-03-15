interface ApiError extends Error {
  cause?: {
    code?: string;
  };
}

// Gunakan Request standar web, bukan NextRequest
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const baseUrl = process.env.ANIME_API_BASE_URL;

  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: "API base URL is not configured" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Tambahkan timeout untuk mencegah menunggu terlalu lama
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const response = await fetch(
      `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
        signal: controller.signal,
        // Tambahkan header User-Agent untuk mencegah beberapa firewall memblokir request
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = `API responded with status code ${response.status}`;
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search Error:", error);

    // Tampilkan detail error yang lebih informatif
    let errorMessage = "Failed to fetch search results";
    let errorDetails = "";

    if (error instanceof Error) {
      const apiError = error as ApiError;
      errorMessage = apiError.message;

      // Tambahkan detail khusus untuk error koneksi
      if (apiError.cause?.code === "ECONNRESET") {
        errorDetails =
          "Connection to API server was reset. The server might be down or unreachable.";
      } else if (apiError.name === "AbortError") {
        errorDetails = "Request timed out after 10 seconds.";
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
