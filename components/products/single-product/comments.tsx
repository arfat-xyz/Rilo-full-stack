"use client";
import { Comment, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { BsStarFill } from "react-icons/bs";
import { BiStar } from "react-icons/bi";
import { getAllComments, postComment } from "@/actions/products";

type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
};

type FormData = {
  content: string;
  rating: number;
};

const CommentSection = ({ productId }: { productId: string }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      content: "",
      rating: 5,
    },
  });

  const ratingValue = watch("rating");

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getAllComments(productId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  // Handle comment submission
  const onSubmit = async (data: FormData) => {
    if (!session) return;

    try {
      setIsSubmitting(true);
      await postComment({ ...data, productId });

      // Refresh comments and reset form
      await fetchComments();
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
          <button
            onClick={fetchComments}
            className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {/* Comment Form - Only for authenticated users */}
      {session ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="font-medium mb-3">Write a Review</h3>

          {/* Rating - Hidden radio inputs with star display */}
          <div className="flex items-center mb-3">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    {...register("rating", { required: "Rating is required" })}
                    value={star}
                    className="sr-only"
                  />
                  <BsStarFill
                    className={`h-5 w-5 ${
                      star <= ratingValue ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setValue("rating", star)}
                  />
                </label>
              ))}
            </div>
            {errors.rating && (
              <span className="ml-2 text-red-500 text-sm">
                {errors.rating.message}
              </span>
            )}
          </div>

          {/* Comment Text */}
          <textarea
            {...register("content", {
              required: "Review content is required",
              minLength: {
                value: 10,
                message: "Review must be at least 10 characters",
              },
            })}
            placeholder="Share your thoughts about this product..."
            className="w-full p-3 border rounded-md mb-3 min-h-[100px]"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mb-2">
              {errors.content.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <p className="text-gray-500">Please sign in to leave a review</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 py-4">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center mb-2">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                  {comment.user.image && (
                    <img
                      src={comment.user.image}
                      alt={comment.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h4 className="font-medium">
                    {comment.user.name || "Anonymous"}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    {/* Rating Stars */}
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <BiStar
                          key={star}
                          className={`h-4 w-4 ${
                            star <= comment.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span className="ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
