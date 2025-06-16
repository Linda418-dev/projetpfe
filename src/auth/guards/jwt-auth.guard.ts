import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //guard personnaliséé pour protéger les routes (que les utilisateur authentifié)
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // si un user introuvable 
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user; 
  }
}

