import { SendIcon } from "lucide-react";
import BaseButton from "../custom/BaseButton";

const PostShareAction = ({ onShare }: { onShare: () => void }) => (
  <BaseButton handleClick={onShare} type="link" className="text-black!">
    <SendIcon className="w-6 h-6" />
  </BaseButton>
);

export default PostShareAction;
