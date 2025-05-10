import {  Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { userRepository } from 'src/user/repositories/user.repository';
import { BcryptService } from 'src/auth/common/bcrypt.service';
import { LoginUserDto } from 'src/user/types/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: userRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async signin(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;
  
    const isEmail = identifier.includes('@');
    const user = await this.userRepository.findOne({
      where: isEmail ? { email: identifier } : { username: identifier },
      select: ['id', 'username', 'email', 'password', 'isActive'],
      relations: ['role'],
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }
  
    const isPasswordValid = await this.bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const token = this.generateJwt(user);
    // return sans password
    const userWithoutPassword = {
    id: user.id,
    username: user.username,
    email: user.email,
    isActive: user.isActive,
    role: user.role,
  };

  return { user: userWithoutPassword, token };
  }
  
  
  private generateJwt(user: User): string {
    const payload = { email: user.email, id: user.id, username: user.username, role: user.role.role };
    return this.jwtService.sign(payload);
  }
}
