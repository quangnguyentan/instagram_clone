import BaseButton from "../custom/BaseButton";
import { BookMarkIcon } from "../ui/Icon";

const PostSaveAction = ({
  onSave,
  isBookmarked,
}: {
  onSave: () => void;
  isBookmarked: boolean;
}) => (
  <BaseButton handleClick={onSave} type="link" className="text-black!">
    <BookMarkIcon
      className={`w-6 h-6 ${isBookmarked && "text-yellow-500/80 fill-yellow-500"}`}
    />
  </BaseButton>
);

export default PostSaveAction;
