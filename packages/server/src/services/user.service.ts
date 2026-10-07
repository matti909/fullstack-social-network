import { UserRepository, type UserDTO } from "../repositories/user.repository.js";

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async listUsers(): Promise<UserDTO[]> {
    return await this.userRepo.findAll();
  }

  async registerUser(username: string, email: string, password: string): Promise<UserDTO> {
    return await this.userRepo.create({ username, email, password });
  }
}
