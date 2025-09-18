import PostCommentAction from "./PostCommentAction";
import PostLikeAction from "./PostLikeAction";
import PostSaveAction from "./PostSaveAction";
import PostShareAction from "./PostShareAction";

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
  return (
    <div className="flex gap-4 justify-between py-2">
      <div className="flex gap-4">
        <PostLikeAction liked={liked} onLike={onLike} />
        <PostCommentAction onComment={onComment} />
        <PostShareAction onShare={onShare} />
      </div>
      <div>
        <PostSaveAction onSave={onSave} />
      </div>
    </div>
  );
};

export default PostActions;
