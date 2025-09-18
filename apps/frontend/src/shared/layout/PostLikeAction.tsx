import BaseButton from "../custom/BaseButton";
import { HeartIcon } from "../ui/Icon";

interface LikeButtonProps {
  liked: string[];
  onLike: () => void;
}

const PostLikeAction = ({ liked, onLike }: LikeButtonProps) => {
  const isLiked = liked.length > 0; // hoặc logic check user id
  return (
    <BaseButton handleClick={onLike} type="link" className="text-black!">
      {isLiked ? (
        <HeartIcon className="w-6 h-6 text-red-500 fill-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6" />
      )}
    </BaseButton>
  );
};

export default PostLikeAction;
