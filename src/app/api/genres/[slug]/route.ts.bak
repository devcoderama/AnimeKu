import type { NextApiRequest, NextApiResponse } from "next";

// Mengambil base URL dari environment variable
const API_BASE_URL = process.env.ANIME_API_BASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query;
    // Konversi slug menjadi string jika itu array
    const slugString = Array.isArray(slug) ? slug[0] : slug;
    const page = req.query.page || "1";

    // Fetch data dari API eksternal dengan base URL dari env
    const response = await fetch(
      `${API_BASE_URL}/api/genres/${slugString}?page=${page}`,
      {
        headers: {
          Accept: "application/json",
        },
        // Cache tidak bisa digunakan dalam format Pages Router, tapi bisa ditambahkan caching terpisah
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching genre anime: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching genre anime:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data anime berdasarkan genre",
    });
  }
}
