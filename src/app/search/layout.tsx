import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { q?: string };
}): Promise<Metadata> {
  const query = searchParams?.q ?? "";
  return {
    title: query ? `Hasil Pencarian: ${query}` : "Pencarian Anime",
    description: query
      ? `Hasil pencarian anime untuk kata kunci "${query}"`
      : "Cari anime favoritmu di sini",
  };
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
