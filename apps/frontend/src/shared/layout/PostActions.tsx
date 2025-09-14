import React from "react";

interface PostActionsProps {
  liked: string[];
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

const PostActions = ({
  liked,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) => {
  return <div>PostActions</div>;
};

export default PostActions;
