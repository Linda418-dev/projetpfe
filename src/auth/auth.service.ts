import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/types/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { userRepository } from 'src/user/repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/common/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly roleRepository: userRoleRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;
  
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new Error('Email already exists');
    }

    console.log("Role reçu:", role);
    const userRole = await this.roleRepository.findOne({ where: { role } });
    console.log("Rôle trouvé en BDD:", userRole);
  
    if (!userRole) {
      throw new Error('Invalid role');
    }
  
    const hashedPassword = await this.bcryptService.hashPassword(password);
    const newUser = this.userRepository.create({ email, password: hashedPassword, role: userRole });
    await this.userRepository.save(newUser);

    const token = this.generateJwt(newUser);
    return { user: newUser, token };
  }
  

  private generateJwt(user: User): string {
    const payload = { email: user.email, id: user.id, role: user.role.role };
    return this.jwtService.sign(payload);
  }
  
}
