import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/types/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { userRepository } from 'src/user/repositories/user.repository';
import { userRoleRepository } from 'src/user-role/repositories/user-role.repository';
import { BcryptService } from 'src/common/bcrypt.service';
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
    const { email, password, role } = createUserDto;


    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    console.log("Role reçu:", role);
    const userRole = await this.roleRepository.findOne({ where: { role } });
    console.log("Rôle trouvé en BDD:", userRole);

    if (!userRole) {
      throw new ConflictException('Invalid role');
    }
    const hashedPassword = await this.bcryptService.hashPassword(password);

   
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: userRole,
    });
    await this.userRepository.save(newUser);

   
    return { user: newUser };
  }

  // 🔹 Méthode de connexion (Signin)
  async signin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { email }, relations: ['role'] });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await this.bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer un token JWT
    const token = this.generateJwt(user);

    return { user, token };
  }

  // 🔹 Génération du Token JWT
  private generateJwt(user: User): string {
    const payload = { email: user.email, id: user.id, role: user.role.role };
    return this.jwtService.sign(payload);
  }
}
