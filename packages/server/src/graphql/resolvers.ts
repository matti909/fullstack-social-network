//import type { Resolvers } from "../../../graphql-types/src/resolvers-types.js";
import type { Resolvers } from "@social/graphql";
import type { AppContext } from "./context.js";
import { GraphQLError } from "graphql";
import * as bcrypt from "bcryptjs";
import { or } from "@prisma/orm-postgres/orm-client";
import {
  toGraphQLComment,
  toGraphQLLike,
  toGraphQLNotification,
  toGraphQLPost,
  toGraphQLUser,
} from "./helpers/mappers.js";
import { signToken } from "../config/jwt.js";

export const resolvers: Resolvers<AppContext> = {
  Query: {
    getUser: async (_, { userId }, { db }) => {
      const id = parseInt(userId, 10);
      if (Number.isNaN(id)) {
        throw new GraphQLError("Invalid user id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const user = await db.orm.public.User.where({ id }).first();

      if (!user) {
        throw new GraphQLError("No user found", {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      return toGraphQLUser(user);
    },

    getPostsByUserId: async (_, args, { db }) => {
      const authorId = parseInt(args.userId, 10);
      if (Number.isNaN(authorId)) {
        throw new GraphQLError("Invalid user id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const posts = await db.orm.public.Post.where({ authorId })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
        .offset(args.offset ?? 0)
        .limit(args.limit ?? 20)
        .all();
      return posts.map(toGraphQLPost);
    },

    getFeed: async (_, args, { db }) => {
      const posts = await db.orm.public.Post.include("author")
        .include("latestComment", (c) => c.include("author"))
        .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
        .offset(args.offset ?? 0)
        .limit(args.limit ?? 20)
        .all();
      return posts.map(toGraphQLPost);
    },

    getNotificationsByUserId: async (_, args, { db }) => {
      const userId = parseInt(args.userId, 10);
      if (Number.isNaN(userId)) {
        throw new GraphQLError("Invalid user id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const notifications = await db.orm.public.Notification.where({ userId })
        .orderBy((n) => n.createdAt.desc())
        .offset(args.offset ?? 0)
        .limit(args.limit ?? 20)
        .all();
      return notifications.map(toGraphQLNotification);
    },

    getCommentsByPostId: async (_, args, { db }) => {
      const postId = parseInt(args.postId, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid post id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      // Padre para el mapeo (fiel al legacy: post inexistente → []).
      const postRow = await db.orm.public.Post.where({ id: postId })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!postRow) return [];
      const post = toGraphQLPost(postRow);
      const comments = await db.orm.public.Comment.where({ postId })
        .include("author")
        .orderBy((c) => c.createdAt.desc())
        .offset(args.offset ?? 0)
        .limit(args.limit ?? 20)
        .all();
      return comments.map((comment) => toGraphQLComment(comment, post));
    },

    getLikesByPostId: async (_, args, { db }) => {
      const postId = parseInt(args.postId, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid post id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const postRow = await db.orm.public.Post.where({ id: postId })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!postRow) return [];
      const post = toGraphQLPost(postRow);
      const likes = await db.orm.public.Like.where({ postId })
        .include("user")
        .orderBy((l) => l.createdAt.desc())
        .offset(args.offset ?? 0)
        .limit(args.limit ?? 20)
        .all();
      return likes.map((like) => toGraphQLLike(like, post));
    },

    searchUsers: async (_, args, { db }) => {
      const q = args.searchQuery?.trim() ?? "";
      if (!q) return [];
      const pattern = `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
      const users = await db.orm.public.User.where((u) =>
        or(u.fullName.ilike(pattern), u.username.ilike(pattern)),
      ).all();
      return users.map(toGraphQLUser);
    },
  },
  Mutation: {
    register: async (_, args, { db }) => {
      const { fullName, username, email, password } = args;

      // Postgres no tiene ER_DUP_ENTRY (MySQL): pre-chequeo en lugar de
      // cazar el error del driver. El UNIQUE de la DB queda como backstop.
      const emailTaken = await db.orm.public.User.where({ email }).first();
      if (emailTaken) {
        throw new GraphQLError("A user with this email already exists", {
          extensions: { code: "USER_ALREADY_EXISTS" },
        });
      }

      const usernameTaken = await db.orm.public.User.where({ username }).first();
      if (usernameTaken) {
        throw new GraphQLError("A user with this username already exists", {
          extensions: { code: "USER_ALREADY_EXISTS" },
        });
      }

      const saved = await db.orm.public.User.create({
        fullName,
        username,
        email,
        password: await bcrypt.hash(password, 10),
        image: "https://i.imgur.com/nzTFnsM.png",
      });

      const token = await signToken(saved.id, saved.email);
      return { token: token, user: toGraphQLUser(saved) };
    },

    signIn: async (_, args, { db }) => {
      const { email, password } = args;

      const user = await db.orm.public.User.where({ email }).first();
      if (!user) {
        throw new GraphQLError("No user found with this email!", {
          extensions: { code: "NO_USER_FOUND" },
        });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        throw new GraphQLError("Incorrect password!", {
          extensions: { code: "INCORRECT_PASSWORD" },
        });
      }

      const token = await signToken(user.id, user.email);

      return { token: token, user: toGraphQLUser(user) };
    },

    post: async (_, args, { db, authUser }) => {
      if (!authUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const author = await db.orm.public.User.where({ id: authUser.id }).first();
      if (!author) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      // FK por id directo: sin fetch previo de entidad como en TypeORM.
      const saved = await db.orm.public.Post.create({
        text: args.text ?? "",
        image: args.image ?? null,
        authorId: author.id,
      });
      await db.orm.public.User.where({ id: author.id }).update({
        postsCount: author.postsCount + 1,
      });

      const row = await db.orm.public.Post.where({ id: saved.id })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!row) {
        throw new GraphQLError("Post not found after create", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
      return toGraphQLPost(row);
    },

    comment: async (_, args, { db, authUser }) => {
      if (!authUser) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const postId = parseInt(args.postId, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid post id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const post = await db.orm.public.Post.where({ id: postId }).first();
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: { code: "POST_NOT_FOUND" },
        });
      }

      const author = await db.orm.public.User.where({ id: authUser.id }).first();
      if (!author) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      const saved = await db.orm.public.Comment.create({
        comment: args.comment,
        postId: post.id,
        authorId: author.id,
      });
      await db.orm.public.Post.where({ id: post.id }).update({
        commentsCount: post.commentsCount + 1,
        latestCommentId: saved.id,
      });

      const parent = await db.orm.public.Post.where({ id: post.id })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!parent) {
        throw new GraphQLError("Post not found after comment", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
      const commentRow = await db.orm.public.Comment.where({ id: saved.id })
        .include("author")
        .first();
      if (!commentRow) {
        throw new GraphQLError("Comment not found after create", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
      return toGraphQLComment(commentRow, toGraphQLPost(parent));
    },

    like: async (_, args, { db, authUser }) => {
      if (!authUser) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const postId = parseInt(args.postId, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid post id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const user = await db.orm.public.User.where({ id: authUser.id }).first();
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      const post = await db.orm.public.Post.where({ id: postId }).first();
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: { code: "POST_NOT_FOUND" },
        });
      }

      // El UNIQUE(userId, postId) del schema impide duplicados (el legacy los permitía).
      const existing = await db.orm.public.Like.where({ userId: user.id })
        .where({ postId: post.id })
        .first();
      if (existing) {
        throw new GraphQLError("Post already liked", {
          extensions: { code: "LIKE_ALREADY_EXISTS" },
        });
      }

      const saved = await db.orm.public.Like.create({
        userId: user.id,
        postId: post.id,
      });
      await db.orm.public.Post.where({ id: post.id }).update({
        likesCount: post.likesCount + 1,
      });

      // Ex-hook @AfterInsert de TypeORM: ahora lógica de servicio explícita.
      await db.orm.public.Notification.create({
        text: `${user.fullName} liked your post`,
        postId: post.id,
        userId: post.authorId,
      });

      const likeRow = await db.orm.public.Like.where({ id: saved.id }).include("user").first();
      if (!likeRow) {
        throw new GraphQLError("Like not found after create", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
      const parent = await db.orm.public.Post.where({ id: post.id })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!parent) {
        throw new GraphQLError("Post not found after like", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
      return toGraphQLLike(likeRow, toGraphQLPost(parent));
    },

    removeLike: async (_, args, { db, authUser }) => {
      if (!authUser) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const postId = parseInt(args.postId, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid postId", {
          extensions: { code: "INVALID_POST_ID" },
        });
      }

      const like = await db.orm.public.Like.where({ userId: authUser.id })
        .where({ postId })
        .include("user")
        .first();
      if (!like) {
        throw new GraphQLError("Like not found", {
          extensions: { code: "LIKE_NOT_FOUND" },
        });
      }

      const parent = await db.orm.public.Post.where({ id: postId })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!parent) {
        throw new GraphQLError("Post not found", {
          extensions: { code: "POST_NOT_FOUND" },
        });
      }

      await db.orm.public.Like.where({ id: like.id }).delete();
      const mapped = toGraphQLPost(parent);
      if (parent.likesCount >= 1) {
        await db.orm.public.Post.where({ id: parent.id }).update({
          likesCount: parent.likesCount - 1,
        });
        mapped.likesCount = parent.likesCount - 1;
      }

      return toGraphQLLike(like, mapped);
    },

    removePost: async (_, { id }, { db }) => {
      const postId = parseInt(id, 10);
      if (Number.isNaN(postId)) {
        throw new GraphQLError("Invalid post id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // TODO(security): el legacy no pedía auth ni ownership para borrar.
      const post = await db.orm.public.Post.where({ id: postId }).include("author").first();
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: { code: "POST_NOT_FOUND" },
        });
      }

      // Comments/likes caen por ON DELETE CASCADE de la DB.
      await db.orm.public.Post.where({ id: postId }).delete();

      if (post.author.postsCount >= 1) {
        await db.orm.public.User.where({ id: post.author.id }).update({
          postsCount: post.author.postsCount - 1,
        });
      }

      return id;
    },

    removeComment: async (_, { id }, { db }) => {
      const commentId = parseInt(id, 10);
      if (Number.isNaN(commentId)) {
        throw new GraphQLError("Invalid comment id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // TODO(security): el legacy no pedía auth ni ownership para borrar.
      const comment = await db.orm.public.Comment.where({ id: commentId })
        .include("author")
        .first();
      if (!comment) {
        throw new GraphQLError("Comment not found", {
          extensions: { code: "COMMENT_NOT_FOUND" },
        });
      }

      const parent = await db.orm.public.Post.where({ id: comment.postId })
        .include("author")
        .include("latestComment", (c) => c.include("author"))
        .first();
      if (!parent) {
        throw new GraphQLError("Post not found", {
          extensions: { code: "POST_NOT_FOUND" },
        });
      }

      await db.orm.public.Comment.where({ id: commentId }).delete();

      const mapped = toGraphQLPost(parent);
      if (parent.commentsCount >= 1) {
        await db.orm.public.Post.where({ id: parent.id }).update({
          commentsCount: parent.commentsCount - 1,
        });
        mapped.commentsCount = parent.commentsCount - 1;
      }
      // El FK latestCommentId es ON DELETE SET NULL: si era el latest, la DB
      // lo nulifica y el objeto mapeado no debe apuntar al borrado.
      if (mapped.latestComment?.id === String(commentId)) {
        mapped.latestComment = null;
      }

      return toGraphQLComment(comment, mapped);
    },

    removeNotification: async (_, { id }, { db }) => {
      const notificationId = parseInt(id, 10);
      if (Number.isNaN(notificationId)) {
        throw new GraphQLError("Invalid notification id", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // TODO(security): el legacy no pedía auth ni ownership para borrar.
      const notification = await db.orm.public.Notification.where({
        id: notificationId,
      }).first();
      if (!notification) {
        throw new GraphQLError("Notification not found", {
          extensions: { code: "NOTIFICATION_NOT_FOUND" },
        });
      }

      await db.orm.public.Notification.where({ id: notificationId }).delete();

      return id;
    },
  },
};
