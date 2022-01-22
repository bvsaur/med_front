import { Comment } from "../types";

interface Props {
  comment: Comment;
}

const CommentCard = ({ comment }: Props) => {
  return (
    <div>
      <p>
        <span className="text-yellow-500">{comment.name}: </span>
        {comment.comment}
      </p>
    </div>
  );
};

export default CommentCard;
