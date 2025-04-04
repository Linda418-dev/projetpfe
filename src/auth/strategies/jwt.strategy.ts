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
      // récupérer le token depuis le header Authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, // vérifie si le token est expiré
      secretOrKey: configService.get<string>('JWT_SECRET'), // récupère la clé secrète des variables d’environnement
    });
  }

  async validate(payload: { id: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['role'], // vérifier que le rôle est bien chargé
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    console.log('Utilisateur authentifié:', user); 
    return user; 
  }
  
}
