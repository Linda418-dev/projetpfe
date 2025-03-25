import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// JwtAuthGuard est un guard qui va verifier le jwt(JSON Web Token )
@Injectable()
export class JwtAuthGuard implements CanActivate {
  //  JwtService  our manipuler  le JWT 
  constructor(private jwtService: JwtService) {}
  //canActivate c'est une interface permet de definir un guard.
  canActivate(context: ExecutionContext): boolean {
    //  recuperer l'obejet request  HTTP
    const request = context.switchToHttp().getRequest();
    console.log('Headers reçus:', request.headers);
    // recupere l'entet de authorization
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // verifier le token avec le clé secret
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'defaultSecret' });
      request.user = decoded; 
      return true;
    } catch (error) {
      console.error('Token error:', error);  
      throw new UnauthorizedException('Invalid token');
    }
  }
}
