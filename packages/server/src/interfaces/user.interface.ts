export interface DBEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface DBUser extends DBEntity {
  username: string;
  email: string;
  password: string;
}

export type DBCreateUser = Pick<DBUser, "email" | "password" | "username">;
