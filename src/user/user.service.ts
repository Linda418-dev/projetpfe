import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { userRepository } from './repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { CreateUserDto } from './types/dto/create-user.dto';
import { UpdateUserDto } from './types/dto/update-user.dto';
import { PaginateSearchDto } from './types/dto/paginate-search.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly userRoleRepository: userRoleRepository,
    private readonly bcryptService: BcryptService,
  ) {}


  async getUsers(){
  return this.userRepository.find({
      relations: ['role', 'affectations', 'anomalies'],
    });
  }

  // methode get All Users
  async getAllUsers(params: PaginateSearchDto) {
  const [users, total] = await this.userRepository.getAllUsersWithPaginate(params);
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
  const user = await this.userRepository.findOne({ 
    where: { id }, 
    relations: ['role', 'affectations'] 
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (updateUserDto.password) {
    updateUserDto.password = await this.bcryptService.hashPassword(updateUserDto.password);
  }

  // Vérification avant de modifier le rôle
  if (updateUserDto.roleId && updateUserDto.roleId !== (user.role as any).id) {
    // Vérifie si l'utilisateur a des affectations
    if (user.affectations && user.affectations.length > 0) {
      throw new ConflictException('User has active affectations, role cannot be changed');
    }

    const newRole = await this.userRoleRepository.findOne({
      where: { id: updateUserDto.roleId },
    });

    if (!newRole) {
      throw new ConflictException('Invalid role ID');
    }

    user.role = newRole;
  }

  // Supprimer roleId pour ne pas l'assigner par erreur via Object.assign
  const { roleId, ...otherUpdates } = updateUserDto;
  Object.assign(user, otherUpdates);

  const savedUser = await this.userRepository.save(user);

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
    

    

     



      
      
}
