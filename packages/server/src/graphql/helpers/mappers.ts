import type { Comment, Like, Notification, Post, User } from "@social/graphql";
import type { Models } from "../../../prisma/contract.js";

export type UserRow = Pick<
  Models.public_User,
  | "id"
  | "fullName"
  | "bio"
  | "email"
  | "username"
  | "image"
  | "coverImage"
  | "postsCount"
  | "createdAt"
>;

export type CommentRow = Pick<Models.public_Comment, "id" | "comment" | "createdAt"> & {
  author: UserRow;
};

export type PostRow = Pick<
  Models.public_Post,
  "id" | "text" | "image" | "commentsCount" | "likesCount" | "latestLike" | "createdAt"
> & {
  author: UserRow;
  latestComment: CommentRow | null;
};

export function toGraphQLUser(row: UserRow): User {
  return {
    id: String(row.id),
    fullName: row.fullName,
    bio: row.bio,
    email: row.email,
    username: row.username,
    // TODO(schema): quitar `password` de `type User` en schema.graphql y re-emitir.
    // El hash nunca debe salir a clientes; "" es placeholder hasta entonces.
    password: "",
    image: row.image,
    coverImage: row.coverImage,
    postsCount: row.postsCount,
    createdAt: String(row.createdAt),
  };
}

export function toGraphQLComment(row: CommentRow, post: Post): Comment {
  return {
    id: String(row.id),
    comment: row.comment,
    author: toGraphQLUser(row.author),
    post,
    createdAt: String(row.createdAt),
  };
}

export function toGraphQLPost(row: PostRow): Post {
  const post: Post = {
    id: String(row.id),
    text: row.text,
    image: row.image,
    author: toGraphQLUser(row.author),
    commentsCount: row.commentsCount,
    likesCount: row.likesCount,
    latestComment: null,
    latestLike: row.latestLike,
    createdAt: String(row.createdAt),
  };
  if (row.latestComment) {
    post.latestComment = toGraphQLComment(row.latestComment, post);
  }
  return post;
}

export type LikeRow = Pick<Models.public_Like, "id" | "createdAt"> & {
  user: UserRow;
};

export type NotificationRow = Pick<
  Models.public_Notification,
  "id" | "text" | "postId" | "createdAt"
>;

export function toGraphQLLike(row: LikeRow, post: Post): Like {
  return {
    id: String(row.id),
    user: toGraphQLUser(row.user),
    post,
    createdAt: String(row.createdAt),
  };
}

export function toGraphQLNotification(row: NotificationRow): Notification {
  return {
    id: String(row.id),
    text: row.text,
    postId: String(row.postId),
    createdAt: String(row.createdAt),
  };
}
