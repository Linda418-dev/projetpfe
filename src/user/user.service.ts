import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { userRepository } from './repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { CreateUserDto } from './types/dto/create-user.dto';
import { UpdateUserDto } from './types/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly userRoleRepository: userRoleRepository,
    private readonly bcryptService: BcryptService
  ) {}
    // methode get All Users
      async getAllUsers() {
        return this.userRepository.find(); 
      }
    // methode get user by id 
      async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }
    //   methode pour creation user
      async createUser(createUserDto: CreateUserDto) {
      const { email, username, password, role } = createUserDto;
      const userExists = await this.userRepository.findOne({ where: [{ email }, { username }] });
        if (userExists) {
          throw new ConflictException('User with this email or username already exists');
        }

    
        const userRole = await this.userRoleRepository.findOne({ where: { role } });
        if (!userRole) {
          throw new ConflictException('Invalid role');
        }
    
        const hashedPassword = await this.bcryptService.hashPassword(password);
    
        const newUser = this.userRepository.create({
          email,
          username,
          password: hashedPassword,
          role: userRole,
        });
    
        return await this.userRepository.save(newUser);
      }
    // methode pour update user 
      async updateUser(id: string, updateUserDto: UpdateUserDto) {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.password) {
        updateUserDto.password = await this.bcryptService.hashPassword(updateUserDto.password);
       }

       Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
      }

      // methode poure desactiver or supprimer user
      async deactivateUser(id: string) {
        const user = await this.userRepository.findOne({
          where: { id },
          relations: ['affectations'],
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        if (user.affectations && user.affectations.length > 0) {
          // si L'utilisateur a des affectations  on le désactive simplement
          user.isActive = false;
          await this.userRepository.save(user);
          return { message: 'User has been deactivated because they have existing affectations.' };
        } else {
          // sinon Aucun  des affectations on peut le supprimer
          await this.userRepository.remove(user);
          return { message: 'User has been deleted successfully because they had no affectations.' };
        }
      }
      

      async activateUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        if (user.isActive) {
          return { message: 'User is already active' };
        }
      
        user.isActive = true;
        await this.userRepository.save(user);
      
        return { message: 'User reactivated successfully' };
      }
      
}
