// src/auth/guards/premium.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HospitalsService } from '../../hospitals/hospitals.service';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private hospitalsService: HospitalsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // From JwtAuthGuard

    if (!user || !user.hospitalId) {
      throw new ForbiddenException('Invalid Session');
    }

    // 🚀 Check the ACTUAL hospital plan in the DB
    const hospital = await this.hospitalsService.findOne(user.hospitalId);
    
    // Check if plan is 'PREMIUM' (as seen in your image_811220.png)
    if (!hospital || hospital.plan.toUpperCase() !== 'PREMIUM') {
      throw new ForbiddenException('Hospital Premium Plan Required');
    }

    return true; 
  }
}