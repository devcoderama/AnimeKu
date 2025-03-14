export interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  type: string;
  score: number;
  latestEpisode?: string;
}

export interface LatestEpisode {
  id: string;
  title: string;
  slug: string;
  animeSlug: string;
  animeTitle: string;
  episodeTitle: string;
  episodeNumber: string;
  image: string;
  type: string;
  views: number;
  duration: string;
  postedAt: string;
}

export interface RecentlyAdded {
  id: string;
  slug: string;
  title: string;
  image: string;
  type: string;
  score: number;
}

export interface AnimeData {
  slider: AnimeItem[];
  latestEpisodes: LatestEpisode[];
  ongoingAnime: AnimeItem[];
  popularAnime: AnimeItem[];
  recentlyAdded: RecentlyAdded[];
}

export interface ApiResponse {
  success: boolean;
  data: AnimeData;
}
