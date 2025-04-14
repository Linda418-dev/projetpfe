import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/types/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { userRepository } from 'src/user/repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { LoginUserDto } from 'src/user/types/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: userRepository,
    private readonly roleRepository: userRoleRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async signin(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;
  
    // Vérifier si l'identifiant est un email ou un username
    const isEmail = identifier.includes('@');
    const user = await this.userRepository.findOne({
      where: isEmail ? { email: identifier } : { username: identifier },
      select: ['id', 'username', 'email', 'password'],
      relations: ['role'],
    });
    
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const isPasswordValid = await this.bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const token = this.generateJwt(user);
  
    return { user, token };
  }
  
  private generateJwt(user: User): string {
    const payload = { email: user.email, id: user.id, username: user.username, role: user.role.role };
    return this.jwtService.sign(payload);
  }
}
