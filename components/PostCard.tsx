import Image from "next/image";
import Link from "next/link";
import { Post } from "../types";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  return (
    <Link href={`/post/${post.slug}`}>
      <div className="border rounded-lg cursor-pointer overflow-hidden group">
        <div className="group-hover:scale-105 transition-transform duration-200 ease-in-out">
          <Image
            layout="responsive"
            width={100}
            height={50}
            src={post.image.url}
          />
        </div>
        <div className="flex justify-between space-x-5 p-5 bg-white items-center">
          <div>
            <p className="text-lg font-bold">{post.title}</p>
            <p className="text-xs">{post.description}</p>
          </div>

          <img
            src={post.author.image.url}
            className="rounded-full h-12 w-12 object-cover"
          />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
