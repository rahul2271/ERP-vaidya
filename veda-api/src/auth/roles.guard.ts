import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required = Public
    }

    const { user } = context.switchToHttp().getRequest();

    // 🔍 DEBUG LOGS: Why is it failing?
    console.log('--- ROLES GUARD CHECK ---');
    console.log('User from Token:', user);
    console.log('User Role:', user?.role);
    console.log('Required Roles:', requiredRoles);

    if (!user || !user.role) {
      // This is likely where your error comes from
      throw new ForbiddenException('Access Denied: No role assigned to user');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
        throw new ForbiddenException(`Access Denied: User role '${user.role}' does not match required roles.`);
    }

    return true;
  }
}