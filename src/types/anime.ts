// File: /types/anime.ts

export type MirrorEmbed = {
  filelions: string | null;
  doodstream: string | null;
  pixeldrain: string | null;
  mp4upload: string | null;
  krakenfiles: string | null;
};

export type MirrorDownload = {
  filelions: string | null;
  pixeldrain: string | null;
  mp4upload: string | null;
  krakenfiles: string | null;
  gofile: string | null;
};

export type Sources = {
  main: string;
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
};

export type EpisodeData = {
  id: string;
  title: string;
  slug: string;
  animeSlug: string;
  animeTitle: string;
  episodeTitle: string;
  episodeNumber: string;
  image: string;
  type: string;
  postedAt: string;
  prevEpisode: string | null;
  nextEpisode: string | null;
  sources: Sources;
};

export type ApiResponse = {
  success: boolean;
  data: EpisodeData;
  message?: string;
};
