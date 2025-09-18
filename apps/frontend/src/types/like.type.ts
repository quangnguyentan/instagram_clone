export interface Like {
  targetType: "post" | "comment" | "reel" | "story";
  targetId: string;
  likes: string[];
  likesCount: number;
}
