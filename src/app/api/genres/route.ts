// Hapus import dari next/server
// import { NextResponse } from "next/server";

// Mengambil base URL dari environment variable
const API_BASE_URL = process.env.ANIME_API_BASE_URL;

export async function GET() {
  try {
    // Fetch data dari API eksternal dengan base URL dari env
    const response = await fetch(`${API_BASE_URL}/api/genres`, {
      headers: {
        Accept: "application/json",
      },
      // next: { revalidate: 3600 }, // Cache selama 1 jam - ini tidak bekerja dalam Web API standar
    });

    if (!response.ok) {
      throw new Error(`Error fetching genres: ${response.status}`);
    }

    const data = await response.json();

    // Gunakan Response standar, bukan NextResponse
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching genres:", error);

    // Gunakan Response standar, bukan NextResponse
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data genre",
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
