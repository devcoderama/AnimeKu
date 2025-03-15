/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const baseUrl = process.env.ANIME_API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      {
        error: "API base URL is not configured",
        data: null,
      },
      { status: 500 }
    );
  }

  try {
    // Hapus "/anime/" dari slug jika ada
    const slug = context.params.slug;
    const cleanSlug = slug.replace(/^\/anime\//, "").replace(/\/$/, "");

    // URL yang akan di-fetch
    const fetchUrl = `${baseUrl}/api/anime/${cleanSlug}`;

    console.log("Fetch URL:", fetchUrl);

    const response = await fetch(fetchUrl, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
      },
    });

    console.log("External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API responded with status code ${response.status}:`,
        errorText
      );

      return NextResponse.json(
        {
          error: `API responded with status code ${response.status}`,
          details: errorText,
          data: null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("Fetched anime data:", JSON.stringify(data).slice(0, 500));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Anime Details Error:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil detail anime",
        details: error instanceof Error ? error.message : "Terjadi kesalahan",
        data: null,
      },
      { status: 503 }
    );
  }
}
