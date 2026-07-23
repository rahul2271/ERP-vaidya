import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HospitalsService } from '../../hospitals/hospitals.service';
export declare class PremiumGuard implements CanActivate {
    private hospitalsService;
    constructor(hospitalsService: HospitalsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
