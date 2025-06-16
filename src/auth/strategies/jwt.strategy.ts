import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { userRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: userRepository,
  ) {
    super({
      // récupérer le token depuis le header authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // vérifie si le token est expiré
      ignoreExpiration: false, 
      // récupère la clé secrète dans .env
      secretOrKey: configService.get<string>('JWT_SECRET'), 
    });
  }
  
  // valider le user 
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
