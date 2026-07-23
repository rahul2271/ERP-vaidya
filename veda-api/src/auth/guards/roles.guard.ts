import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator'; 

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      this.logger.warn('Blocked: Token is missing user data or role.');
      throw new ForbiddenException('Access Denied: Invalid user session.');
    }

    // 🚀 NEW EMOJI LOGS so we can see exactly what happens on Render
    this.logger.log(`🔍 Checking Role: '${user.role}' against Allowed: [${requiredRoles.join(', ')}]`);

    // 🚀 THE FIX: Use .trim() to destroy invisible spaces before comparing!
    const hasRole = requiredRoles.some((role) => {
      const dbRole = user.role.trim().toUpperCase();
      const allowedRole = role.trim().toUpperCase();
      
      return dbRole === allowedRole;
    });

    this.logger.log(`✅ Did roles match? ${hasRole ? 'YES' : 'NO'}`);

    if (!hasRole) {
      this.logger.warn(`Blocked: User role '${user.role}' tried to access a route requiring [${requiredRoles.join(', ')}]`);
      throw new ForbiddenException(`Access Denied: User role '${user.role}' does not match required roles.`);
    }

    return true; 
  }
}
