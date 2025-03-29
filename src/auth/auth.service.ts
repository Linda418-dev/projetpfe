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

  async signup(createUserDto: CreateUserDto) {
    const { email, username, password, role } = createUserDto;

    // Vérifier qu'on ne reçoit pas les deux en même temps
    if (!email && !username) {
      throw new ConflictException('You must provide either a username or an email');
    }
    if (email && username) {
      throw new ConflictException('You cannot provide both username and email');
    }

    // Vérifier si l'utilisateur existe déjà (par email ou par username)
    const userExists = await this.userRepository.findOne({
      where: [
        { email: email || undefined },
        { username: username || undefined },
      ],
    });
    if (userExists) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Vérifier si le rôle existe
    const userRole = await this.roleRepository.findOne({ where: { role } });

    if (!userRole) {
      throw new ConflictException('Invalid role');
    }

    // Hasher le mot de passe
    const hashedPassword = await this.bcryptService.hashPassword(password);

    // Créer et sauvegarder l'utilisateur
    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: userRole,
    });
    await this.userRepository.save(newUser);

    return { user: newUser };
  }

  async signin(loginUserDto: LoginUserDto) {
    const { email, username, password } = loginUserDto;

    // Chercher l'utilisateur soit par email, soit par username
    const user = await this.userRepository.findOne({
      where: [
        { email: email || undefined },
        { username: username || undefined },
      ],
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
