export type PromptResult = {
  song: string;
  artist: string;
  description: string;
};

export type Song = {
  id: string;
  title: string;
  artists: string[];
  image: string;
  preview: string;
};
