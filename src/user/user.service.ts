import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { userRepository } from './repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { CreateUserDto } from './types/dto/create-user.dto';
import { UpdateUserDto } from './types/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: userRepository,
    private readonly roleRepo: userRoleRepository,
    private readonly bcryptService: BcryptService
  ) {}
     
      async getAllUsers() {
        return this.userRepo.find(); 
      }

      async getUserById(id: string) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }
     
      async createUser(createUserDto: CreateUserDto) {
      const { email, username, password, role } = createUserDto;
      const userExists = await this.userRepo.findOne({ where: [{ email }, { username }] });
        if (userExists) {
          throw new ConflictException('User with this email or username already exists');
        }

    
        const userRole = await this.roleRepo.findOne({ where: { role } });
        if (!userRole) {
          throw new ConflictException('Invalid role');
        }
    
        const hashedPassword = await this.bcryptService.hashPassword(password);
    
        const newUser = this.userRepo.create({
          email,
          username,
          password: hashedPassword,
          role: userRole,
        });
    
        return await this.userRepo.save(newUser);
      }
    
      async updateUser(id: string, updateUserDto: UpdateUserDto) {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.password) {
        updateUserDto.password = await this.bcryptService.hashPassword(updateUserDto.password);
       }

       Object.assign(user, updateUserDto);
        return await this.userRepo.save(user);
      }

    
      async deleteUser(id: string) {
        const user = await this.userRepo.findOne({ where: { id } });
    
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        await this.userRepo.remove(user);
        return { message: 'User deleted successfully' };
      }
}
