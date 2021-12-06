declare interface YoutubeVideoSuggestion {
  videoId: Nullable<string>;
  title: Nullable<string>;
  thumbnail: Nullable<{
    width?: Nullable<number>;
    height?: Nullable<number>;
    url?: Nullable<string>;
  }>;
}
