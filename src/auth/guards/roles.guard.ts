import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector permet du utilser peour accéderer  a un décorateur personnalisé
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
     // Récupere tous le role 
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    // si n'est pas proteger par des role spécifique  on doit laisse l'accées
    if (!requiredRoles) {
      return true;
    }
    // recupere le user authentifier Via JwtAuthGuard
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // verifier que le user dans le liste des user autorisé 
    return requiredRoles.includes(user.role?.role); 
  }
}
