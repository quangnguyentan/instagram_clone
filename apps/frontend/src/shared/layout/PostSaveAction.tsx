import BaseButton from "../custom/BaseButton";
import { BookMarkIcon } from "../ui/Icon";

const PostSaveAction = ({ onSave }: { onSave: () => void }) => (
  <BaseButton handleClick={onSave} type="link" className="text-black!">
    <BookMarkIcon className="w-6 h-6" />
  </BaseButton>
);

export default PostSaveAction;
