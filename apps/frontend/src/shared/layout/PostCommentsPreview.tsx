import { Comment } from "@/types/comment.type";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import React, { useState } from "react";

interface Props {
  comments: Comment[];
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const PostCommentsPreview = ({ comments, onUpdate, onDelete }: Props) => {
  const { user } = useAuthStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  if (!comments?.length) {
    return <div className="text-sm text-gray-500 px-2">No comments yet</div>;
  }

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditValue(content);
  };

  const handleSave = (id: string) => {
    if (editValue.trim()) {
      onUpdate(id, editValue);
    }
    setEditingId(null);
  };
  //   console.log(user?._id, "userid");
  //   console.log(comments[0].user?._id, "comment user id");
  return (
    <div className="px-2 space-y-2">
      {comments.map((cmt) => (
        <div
          key={cmt._id}
          className="flex items-start justify-between bg-gray-50 p-2 rounded-md"
        >
          <div className="text-sm flex-1">
            <span className="font-semibold mr-1">{cmt.user?.username}</span>
            {editingId === cmt._id ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring focus:ring-blue-200"
                autoFocus
              />
            ) : (
              <span>{cmt.content}</span>
            )}
          </div>

          {user?._id === cmt.user?._id && (
            <div className="flex gap-2 text-xs ml-2">
              {editingId === cmt._id ? (
                <>
                  <button
                    onClick={() => handleSave(cmt._id)}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(cmt._id, cmt.content)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(cmt._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostCommentsPreview;
