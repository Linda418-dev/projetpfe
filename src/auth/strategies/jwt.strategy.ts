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
      // vérifie si le token est expiré
      ignoreExpiration: false, 
      // récupère la clé secrète des variables d’environnement
      secretOrKey: configService.get<string>('JWT_SECRET'), 
    });
  }

  async validate(payload: { id: string }){
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['role'], 
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
      return user; 
  }
  
}
