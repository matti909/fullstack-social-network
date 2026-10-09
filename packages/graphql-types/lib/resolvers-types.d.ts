import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    Upload: {
        input: unknown;
        output: unknown;
    };
};
export type AuthPayload = {
    __typename?: 'AuthPayload';
    token: Scalars['String']['output'];
    user: User;
};
export type Comment = {
    __typename?: 'Comment';
    author: User;
    comment: Scalars['String']['output'];
    createdAt: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    post: Post;
};
export type File = {
    __typename?: 'File';
    encoding?: Maybe<Scalars['String']['output']>;
    filename?: Maybe<Scalars['String']['output']>;
    mimetype?: Maybe<Scalars['String']['output']>;
    url?: Maybe<Scalars['String']['output']>;
};
export type Like = {
    __typename?: 'Like';
    createdAt: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    post: Post;
    user: User;
};
export type Mutation = {
    __typename?: 'Mutation';
    comment?: Maybe<Comment>;
    like?: Maybe<Like>;
    post?: Maybe<Post>;
    register: AuthPayload;
    removeComment?: Maybe<Comment>;
    removeLike?: Maybe<Like>;
    removeNotification?: Maybe<Scalars['ID']['output']>;
    removePost?: Maybe<Scalars['ID']['output']>;
    setUserBio?: Maybe<User>;
    setUserCover?: Maybe<User>;
    setUserPhoto?: Maybe<User>;
    signIn: AuthPayload;
    uploadFile?: Maybe<File>;
};
export type MutationCommentArgs = {
    comment: Scalars['String']['input'];
    postId: Scalars['ID']['input'];
};
export type MutationLikeArgs = {
    postId: Scalars['ID']['input'];
};
export type MutationPostArgs = {
    image?: InputMaybe<Scalars['String']['input']>;
    text?: InputMaybe<Scalars['String']['input']>;
};
export type MutationRegisterArgs = {
    email: Scalars['String']['input'];
    fullName: Scalars['String']['input'];
    password: Scalars['String']['input'];
    username: Scalars['String']['input'];
};
export type MutationRemoveCommentArgs = {
    id: Scalars['ID']['input'];
};
export type MutationRemoveLikeArgs = {
    postId: Scalars['ID']['input'];
};
export type MutationRemoveNotificationArgs = {
    id: Scalars['ID']['input'];
};
export type MutationRemovePostArgs = {
    id: Scalars['ID']['input'];
};
export type MutationSetUserBioArgs = {
    bio: Scalars['String']['input'];
};
export type MutationSetUserCoverArgs = {
    file: Scalars['Upload']['input'];
};
export type MutationSetUserPhotoArgs = {
    file: Scalars['Upload']['input'];
};
export type MutationSignInArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};
export type MutationUploadFileArgs = {
    file: Scalars['Upload']['input'];
};
export type Notification = {
    __typename?: 'Notification';
    createdAt: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    postId: Scalars['ID']['output'];
    text: Scalars['String']['output'];
};
export type Post = {
    __typename?: 'Post';
    author: User;
    commentsCount: Scalars['Int']['output'];
    createdAt: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    image?: Maybe<Scalars['String']['output']>;
    latestComment?: Maybe<Comment>;
    latestLike?: Maybe<Scalars['String']['output']>;
    likedByAuthUser?: Maybe<Scalars['Boolean']['output']>;
    likesCount: Scalars['Int']['output'];
    text?: Maybe<Scalars['String']['output']>;
};
export type Query = {
    __typename?: 'Query';
    getCommentsByPostId?: Maybe<Array<Maybe<Comment>>>;
    getFeed?: Maybe<Array<Maybe<Post>>>;
    getLikesByPostId?: Maybe<Array<Maybe<Like>>>;
    getNotificationsByUserId?: Maybe<Array<Maybe<Notification>>>;
    getPostsByUserId?: Maybe<Array<Maybe<Post>>>;
    getUser?: Maybe<User>;
    message: Scalars['String']['output'];
    searchUsers?: Maybe<Array<Maybe<User>>>;
};
export type QueryGetCommentsByPostIdArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    postId: Scalars['ID']['input'];
};
export type QueryGetFeedArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
};
export type QueryGetLikesByPostIdArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    postId: Scalars['ID']['input'];
};
export type QueryGetNotificationsByUserIdArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    userId: Scalars['ID']['input'];
};
export type QueryGetPostsByUserIdArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    userId: Scalars['ID']['input'];
};
export type QueryGetUserArgs = {
    userId: Scalars['ID']['input'];
};
export type QuerySearchUsersArgs = {
    searchQuery?: InputMaybe<Scalars['String']['input']>;
};
export type User = {
    __typename?: 'User';
    bio?: Maybe<Scalars['String']['output']>;
    coverImage?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['String']['output'];
    email: Scalars['String']['output'];
    fullName: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    image?: Maybe<Scalars['String']['output']>;
    password: Scalars['String']['output'];
    postsCount: Scalars['Int']['output'];
    token?: Maybe<Scalars['String']['output']>;
    username: Scalars['String']['output'];
};
export type ResolverTypeWrapper<T> = Promise<T> | T;
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export type NextResolverFn<T> = () => Promise<T>;
export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    AuthPayload: ResolverTypeWrapper<AuthPayload>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
    Comment: ResolverTypeWrapper<Comment>;
    File: ResolverTypeWrapper<File>;
    ID: ResolverTypeWrapper<Scalars['ID']['output']>;
    Int: ResolverTypeWrapper<Scalars['Int']['output']>;
    Like: ResolverTypeWrapper<Like>;
    Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
    Notification: ResolverTypeWrapper<Notification>;
    Post: ResolverTypeWrapper<Post>;
    Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
    User: ResolverTypeWrapper<User>;
};
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    AuthPayload: AuthPayload;
    Boolean: Scalars['Boolean']['output'];
    Comment: Comment;
    File: File;
    ID: Scalars['ID']['output'];
    Int: Scalars['Int']['output'];
    Like: Like;
    Mutation: Record<PropertyKey, never>;
    Notification: Notification;
    Post: Post;
    Query: Record<PropertyKey, never>;
    String: Scalars['String']['output'];
    Upload: Scalars['Upload']['output'];
    User: User;
};
export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
    token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};
export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
    author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
};
export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
    encoding?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    mimetype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};
export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
    createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationCommentArgs, 'comment' | 'postId'>>;
    like?: Resolver<Maybe<ResolversTypes['Like']>, ParentType, ContextType, RequireFields<MutationLikeArgs, 'postId'>>;
    post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, Partial<MutationPostArgs>>;
    register?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'fullName' | 'password' | 'username'>>;
    removeComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationRemoveCommentArgs, 'id'>>;
    removeLike?: Resolver<Maybe<ResolversTypes['Like']>, ParentType, ContextType, RequireFields<MutationRemoveLikeArgs, 'postId'>>;
    removeNotification?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemoveNotificationArgs, 'id'>>;
    removePost?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemovePostArgs, 'id'>>;
    setUserBio?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSetUserBioArgs, 'bio'>>;
    setUserCover?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSetUserCoverArgs, 'file'>>;
    setUserPhoto?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSetUserPhotoArgs, 'file'>>;
    signIn?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'email' | 'password'>>;
    uploadFile?: Resolver<Maybe<ResolversTypes['File']>, ParentType, ContextType, RequireFields<MutationUploadFileArgs, 'file'>>;
};
export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
    createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    postId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};
export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
    author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    commentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    latestComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
    latestLike?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    likedByAuthUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    getCommentsByPostId?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType, RequireFields<QueryGetCommentsByPostIdArgs, 'postId'>>;
    getFeed?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, Partial<QueryGetFeedArgs>>;
    getLikesByPostId?: Resolver<Maybe<Array<Maybe<ResolversTypes['Like']>>>, ParentType, ContextType, RequireFields<QueryGetLikesByPostIdArgs, 'postId'>>;
    getNotificationsByUserId?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<QueryGetNotificationsByUserIdArgs, 'userId'>>;
    getPostsByUserId?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, RequireFields<QueryGetPostsByUserIdArgs, 'userId'>>;
    getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'userId'>>;
    message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    searchUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<QuerySearchUsersArgs>>;
};
export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
    name: 'Upload';
}
export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
    bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    postsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};
export type Resolvers<ContextType = any> = {
    AuthPayload?: AuthPayloadResolvers<ContextType>;
    Comment?: CommentResolvers<ContextType>;
    File?: FileResolvers<ContextType>;
    Like?: LikeResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    Notification?: NotificationResolvers<ContextType>;
    Post?: PostResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    Upload?: GraphQLScalarType;
    User?: UserResolvers<ContextType>;
};
