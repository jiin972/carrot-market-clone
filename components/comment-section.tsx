"use client";

interface CommentSectionProps {
  comments: {
    postId: number;
    id: number;
    created_at: Date;
    updated_at: Date;
    userId: number;
    payload: string;
  }[];

  postId: number;
}
export default function CommentSection({
  comments,
  postId,
}: CommentSectionProps) {
  const onSubmit = async () => {};
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>{comment.payload}</div>
      ))}
    </div>
  );
}
