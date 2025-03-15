// /app/api/nonton/route.ts

// Definisi tipe data untuk respons API
type MirrorEmbed = {
  filelions: string | null;
  doodstream: string | null;
  pixeldrain: string | null;
  mp4upload: string | null;
  krakenfiles: string | null;
};

type MirrorDownload = {
  filelions: string | null;
  pixeldrain: string | null;
  mp4upload: string | null;
  krakenfiles: string | null;
  gofile: string | null;
};

type ApiData = {
  token: string;
  blog: string;
  src: string;
  mirror: {
    embed: {
      v360p: MirrorEmbed;
      v480p: MirrorEmbed;
      v720p: MirrorEmbed;
      v1080p: MirrorEmbed;
    };
    download: {
      v360p: MirrorDownload;
      v480p: MirrorDownload;
      v720p: MirrorDownload;
      v1080p: MirrorDownload;
    };
    filelions: string | null;
    blog: string | null;
    raw: string | null;
  };
};

type ApiResponse = {
  judulEpisode: string;
  gambar: string;
  metadata: {
    deskripsi: string;
    publishedTime: string;
    ogImage: string;
    canonicalUrl: string;
  };
  apiData: ApiData;
};

export async function GET(request: Request) {
  try {
    // Mendapatkan parameter URL dari query string
    const url = new URL(request.url);
    const episodeUrl = url.searchParams.get("url");

    if (!episodeUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parameter URL tidak ditemukan",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Mengambil ANIME_API_BASE_URL dari environment variable
    const ANIME_API_BASE_URL = process.env.ANIME_API_BASE_URL;

    if (!ANIME_API_BASE_URL) {
      throw new Error(
        "ANIME_API_BASE_URL tidak ditemukan di environment variables"
      );
    }

    // URL API untuk mendapatkan data episode
    const apiUrl = `${ANIME_API_BASE_URL}/api/nonton?url=${episodeUrl}`;

    console.log(`Fetching episode data from: ${apiUrl}`);

    // Fetch data dari API
    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse respons JSON
    const result = (await response.json()) as ApiResponse;

    if (!result) {
      throw new Error("Data episode tidak tersedia");
    }

    // Ekstrak slug anime dari URL
    let animeSlug = "";
    const urlParts = episodeUrl.split("-");
    if (urlParts.length > 2 && urlParts[0] === "nonton") {
      // Menghapus "nonton-" dan "episode-X" dari URL untuk mendapatkan slug anime
      const epIndex = urlParts.findIndex((part) => part === "episode");
      if (epIndex > 0) {
        animeSlug = urlParts.slice(1, epIndex).join("-");
      }
    }

    // Ekstrak nomor episode
    let episodeNumber = "";
    const episodeParts = episodeUrl.split("episode-");
    if (episodeParts.length > 1) {
      episodeNumber = episodeParts[1];
    }

    // Tambahkan data navigasi ke episode sebelumnya dan selanjutnya
    // (Ini sederhananya, Anda mungkin perlu algoritma yang lebih canggih)
    const epNum = parseInt(episodeNumber, 10);
    let prevEpisode = null;
    let nextEpisode = null;

    if (!isNaN(epNum) && epNum > 1) {
      prevEpisode = `nonton-${animeSlug}-episode-${epNum - 1}`;
    }

    // Next episode disediakan hanya jika episodenya belum sampai ke episode terbaru
    // Perlu logika tambahan untuk menentukan episode maksimal
    nextEpisode = `nonton-${animeSlug}-episode-${epNum + 1}`;

    // Format ulang data untuk dikonsumsi oleh front-end
    const formattedResponse = {
      success: true,
      data: {
        id: `episode-${episodeUrl}`,
        title: result.judulEpisode,
        slug: episodeUrl,
        animeSlug: animeSlug,
        animeTitle: result.judulEpisode.replace(
          ` Episode ${episodeNumber}`,
          ""
        ),
        episodeTitle: `Episode ${episodeNumber}`,
        episodeNumber: episodeNumber,
        image: result.gambar,
        type: "TV", // Default, bisa disesuaikan jika data tersedia
        postedAt: result.metadata.publishedTime,
        prevEpisode: prevEpisode,
        nextEpisode: nextEpisode,
        sources: {
          main: result.apiData.src,
          embed: result.apiData.mirror.embed,
          download: result.apiData.mirror.download,
        },
      },
    };

    // Mengembalikan data yang diperoleh dari API dalam format yang disesuaikan
    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching episode data:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data episode",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
