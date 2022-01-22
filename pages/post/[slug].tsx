import { GetStaticProps } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import Header from "../../components/Header";
import { Post } from "../../types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import CommentCard from "../../components/CommentCard";

interface IFormInput {
  id?: string;
  post: string;
  name: string;
  email: string;
  comment: string;
  published_at: null;
}

interface Props {
  post: Post;
}

const PostPage = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    delete data.id;
    data.published_at = null;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  return (
    <main>
      <Head>
        <title>Medium 2.0 | {post.title}</title>
      </Head>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={post.image.url}
        alt={post.title}
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="font-bold text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light">{post.description}</h2>

        <div className="flex items-center space-x-5">
          <img
            className="h-10 w-10 rounded-full"
            src={post.author.image.url}
            alt={post.author.name}
          />
          <div className="font-extralight text-sm my-3">
            <p className="text-green-600">{post.author.name}</p>
            <p>{new Date(post.created_at).toDateString()}</p>
          </div>
        </div>

        <div className="mt-10">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

        {submitted ? (
          <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold">
              Thank your for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear below.</p>
          </div>
        ) : (
          <form
            className="flex flex-col p-5 my-10 max-w-2xl mb-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>

            <hr className="py-3 mt-2" />

            <input
              {...register("post")}
              type="hidden"
              name="post"
              value={post.id}
            />

            <label className="block mb-5">
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full focus:ring ring-yellow-500 outline-none"
                type="text"
                placeholder="Write your name here"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full focus:ring ring-yellow-500 outline-none"
                type="email"
                placeholder="Write your email here"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full focus:ring ring-yellow-500 outline-none"
                placeholder="Write your comments"
                rows={8}
              ></textarea>
            </label>

            <div>
              {errors.name && (
                <p className="text-red-500">The name field is required.</p>
              )}
              {errors.email && (
                <p className="text-red-500">The email field is required.</p>
              )}
              {errors.comment && (
                <p className="text-red-500">The comment field is required.</p>
              )}
            </div>

            <input
              className="shadow bg-yellow-500 hover:bg-yellow-400 outline-none text-white py-2 px-4 rounded cursor-pointer"
              type="submit"
              value="Submit"
            />
          </form>
        )}

        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />

          {!post.comments.length ? (
            <p>Not comments yet</p>
          ) : (
            post.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </article>
    </main>
  );
};

export const getStaticPaths = async () => {
  const url = `${process.env.API_URL}/posts/paths`;
  const response = await fetch(url);
  const posts = await response.json();

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const url = `${process.env.API_URL}/posts?slug=${params?.slug}`;
  const response = await fetch(url);
  const post = await response.json();

  if (!post.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: post[0],
    },
    revalidate: 60, // after 60 seconds it will update the old cached version
  };
};

export default PostPage;
