import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { HospitalsService } from '../hospitals/hospitals.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private hospitalsService;
    constructor(configService: ConfigService, hospitalsService: HospitalsService);
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        role: any;
        hospitalId: any;
    }>;
}
export {};
