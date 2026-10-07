import { Types } from "mongoose";
import { UserModel } from "../models/user.js";
import type { UserSchema } from "../models/user.js";
import type { IDatabaseResource } from "../config/types.js";
import type { DBCreateUser } from "../interfaces/user.interface.js";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository implements IDatabaseResource<UserDTO, DBCreateUser> {
  private toDTO(doc: UserSchema & { _id: Types.ObjectId }): UserDTO {
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(data: DBCreateUser): Promise<UserDTO> {
    const created = await UserModel.create(data);
    return this.toDTO(created.toObject());
  }

  async findAll(): Promise<UserDTO[]> {
    const docs = await UserModel.find().lean();
    return docs.map((doc) => this.toDTO(doc));
  }

  async delete(id: string): Promise<UserDTO | null> {
    const doc = await UserModel.findByIdAndDelete(id).lean();
    return doc ? this.toDTO(doc) : null;
  }
}
