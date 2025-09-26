import BaseButton from "../custom/BaseButton";
import { HeartIcon } from "../ui/Icon";

interface LikeButtonProps {
  liked: boolean;
  onLike: () => void;
}

const PostLikeAction = ({ liked, onLike }: LikeButtonProps) => {
  return (
    <BaseButton handleClick={onLike} type="link" className="text-black!">
      {liked ? (
        <HeartIcon className="w-6 h-6 text-red-500 fill-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6" />
      )}
    </BaseButton>
  );
};

export default PostLikeAction;
