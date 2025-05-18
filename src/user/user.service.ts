import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { userRepository } from './repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { CreateUserDto } from './types/dto/create-user.dto';
import { UpdateUserDto } from './types/dto/update-user.dto';
import * as nodemailer from 'nodemailer';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly userRoleRepository: userRoleRepository,
    private readonly bcryptService: BcryptService
  ) {}

    // methode get All Users
   async getAllUsers(params: PaginateSearchDto, currentUserId: string) {
  const [users, total] = await this.userRepository.getAllUsersWithPaginate(params, currentUserId);

  return {
    data: users,
    total,
    skip: params.skip,
    take: params.take,
  };
}

    
    // méthode get user by id 
      async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }

      // méthode create user 
      async createUser(createUserDto: CreateUserDto) {
        const { email, username, password, roleId } = createUserDto;
      
        const userExists = await this.userRepository.findOne({
          where: [{ email }, { username }],
        });
      
        if (userExists) {
          throw new ConflictException('User with this email or username already exists');
        }
      
        const userRole = await this.userRoleRepository.findOne({
          where: { id: roleId },
        });
      
        if (!userRole) {
          throw new ConflictException('Invalid role ID');
        }
      
        const hashedPassword = await this.bcryptService.hashPassword(password);
      
        const newUser = this.userRepository.create({
          email,
          username,
          password: hashedPassword,
          role: userRole,
        });
      
        const savedUser = await this.userRepository.save(newUser);
        return {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
          role: savedUser.role,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        };
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
        const  savedUser = await this.userRepository.save(user);
        return {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
          role: savedUser.role,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        };
      }

      // méthode poure  supprimer user  s'il n'a pas d’affectations. 
      async deleteUser(targetUserId: string, currentUserId: string) {
        if (targetUserId === currentUserId) {
          throw new ConflictException('You cannot delete your own account');
        }
      
        const user = await this.userRepository.findOne({
          where: { id: targetUserId },
          relations: ['affectations'],
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        if (user.affectations?.length > 0) {
          throw new ConflictException('User has affectations and cannot be deleted. Please deactivate them instead');
        }
      
        await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
      }

      // méthode pour désactiver compte d'un user 
      async deactivateUser(userId: string, currentUserId: string) {
        if (userId === currentUserId) {
          throw new ConflictException('You cannot deactivate your own account');
        }
      
        const user = await this.userRepository.findOne({ where: { id: userId } });
      
        if (!user) {
          throw new NotFoundException('User not found.');
        }
      
        if (!user.isActive) {
          return { message: 'User is already deactivated.' };
        }
      
        user.isActive = false;
        await this.userRepository.save(user);
      
        return { message: 'User has been deactivated successfully.' };
      }
      
      
      
      // méthode pour activer compte d'un user 
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

      async updatePlayerId(userId: number, playerId: string) {
        await this.userRepository.update(userId, { playerId });
        return { message: 'Player ID mis à jour' };
      }
    

      async forgotPassword(email: string) {
        try {
          const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
          });
      
          if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
          }
      
          const newPassword = Math.random().toString(36).slice(-8);
          const hashed = await this.bcryptService.hashPassword(newPassword);
      
          user.password = hashed;
          await this.userRepository.save(user);
      
          const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            auth: {
              user: 'ee985995fcd1b5', 
              pass: '8fbaca3ca6fd30', 
            },
          });
      
          await transporter.sendMail({
            from: '"Support App" <no-reply@app.com>',
            to: user.email,
            subject: 'Réinitialisation du mot de passe',
            text: `Bonjour,\n\nVoici votre nouveau mot de passe temporaire : ${newPassword}\n\nMerci.`,
          });
      
          return { message: 'Un nouveau mot de passe a été envoyé à votre adresse email.' };
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException('Une erreur est survenue, veuillez réessayer plus tard.');
        }
      }
      
      
}
