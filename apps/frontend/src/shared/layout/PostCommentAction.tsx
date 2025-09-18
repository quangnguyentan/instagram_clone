import BaseButton from "../custom/BaseButton";
import { MessageIcon } from "../ui/Icon";

const PostCommentAction = ({ onComment }: { onComment: () => void }) => (
  <BaseButton handleClick={onComment} type="link" className="text-black!">
    <MessageIcon className="w-6 h-6" />
  </BaseButton>
);

export default PostCommentAction;
