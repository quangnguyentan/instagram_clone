import { formatNumber } from "@/lib/format";
import React from "react";

const PostLikes = ({ count }: { count: number }) => {
  return (
    <div className="py-1 text-sm font-semibold">
      {formatNumber(count)} lượt thích
    </div>
  );
};

export default PostLikes;
