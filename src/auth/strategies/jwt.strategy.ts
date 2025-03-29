import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { userRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: userRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Récupérer le token depuis le header Authorization
      ignoreExpiration: false, // Vérifie si le token est expiré
      secretOrKey: configService.get<string>('JWT_SECRET'), // Récupère la clé secrète des variables d’environnement
    });
  }

  async validate(payload: { id: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['role'], // Vérifier que le rôle est bien chargé
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    console.log('Utilisateur authentifié:', user); // Debugging
    return user; 
  }
  
}
