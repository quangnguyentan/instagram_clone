import Image from "next/image";
import React from "react";
import PostMeta from "./PostMeta";
import { Comment } from "@/types/comment.type";
import defaultUser from "@/assets/images/default_user.svg";
import { useTimeAgo } from "@/hooks/useTimeAgo";

interface PostCommentProps {
  comment: Comment;
  comments: Comment[];
  onReply: () => void;
  onToggleReplies: () => void;
  explain: { [key: string]: boolean };
  createdAt: string;
  likesCount: number;
}

const PostComment = ({
  comment,
  explain,
  onReply,
  onToggleReplies,
  comments,
  createdAt,
  likesCount,
}: PostCommentProps) => {
  const createdComment = useTimeAgo(createdAt);
  return (
    <div className="text-gray-700">
      <div className="flex items-center gap-2">
        <Image
          src={comment?.user?.avatarUrl || defaultUser}
          alt={comment?.user?.username}
          width={28}
          height={28}
        />
        <p className="text-sm break-words line-clamp-2">
          <span className="font-semibold mr-1">{comment?.user?.username}</span>
          {comment.content}
        </p>
      </div>
      <PostMeta
        createdAt={createdComment}
        likesCount={likesCount}
        repliesCount={
          comments.filter((c) => c?.parent?._id === comment._id)?.length
        }
        handleReply={onReply}
        onToggleReplies={onToggleReplies}
        isExpanded={!!explain[comment._id]}
      />
      {explain[comment._id] &&
        comments
          .filter((c) => c?.parent?._id === comment?._id)
          .map((reply: Comment, replyIdx) => (
            <div key={replyIdx} className="ml-8 mt-2">
              <div className="flex items-center gap-2">
                <Image
                  src={reply?.user?.avatarUrl || defaultUser}
                  alt={reply?.user?.username}
                  width={24}
                  height={24}
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{reply?.user?.username}</p>
                  <p>
                    {(() => {
                      const [mention, ...rest] = reply.content.split(" ");
                      return (
                        <>
                          <span className="text-blue-500 cursor-pointer">
                            {mention}
                          </span>{" "}
                          <span className="text-black">{rest.join(" ")}</span>
                        </>
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default PostComment;
