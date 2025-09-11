import { Post } from "@/types/post.type";
import { create } from "zustand";

interface PostState {
  post: Post | null;
  setPost: (post: Post) => void;
  clearPost: () => void;
}

const usePostStore = create<PostState>((set) => ({
  post: null,
  setPost: (post) => set({ post }),
  clearPost: () => set({ post: null }),
}));

export default usePostStore;
