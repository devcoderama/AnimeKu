import { NextRequest, NextResponse } from "next/server";

interface ApiError extends Error {
  cause?: {
    code?: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.ANIME_API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "API base URL is not configured" },
      { status: 500 }
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
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
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

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 503 } // Service Unavailable
    );
  }
}
