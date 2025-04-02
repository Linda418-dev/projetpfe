import { Injectable } from '@nestjs/common';
import { userRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly  userRepo : userRepository ){}
    async getAllUsers() {
        return this.userRepo.find(); 
      }
}
