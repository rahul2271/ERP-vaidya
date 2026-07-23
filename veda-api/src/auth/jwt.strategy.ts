// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET') || 'YOUR_SECRET_KEY',
//     });
//   }

//   async validate(payload: any) {
//     // 🔍 DEBUG: Print exactly what is inside the token
//     console.log('--- JWT UNPACKING ---');
//     console.log('Token Payload:', payload);

//     // ✅ FORCE THE ROLE: We pass the entire payload directly
//     return { 
//       userId: payload.sub,
//       email: payload.email,
//       // CRITICAL: This line was missing or broken before
//       role: payload.role, 
//       hospitalId: payload.hospitalId
//     };
//   }
// }

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       // Ensure this matches the secret used in AuthService
//       secretOrKey: configService.get<string>('JWT_SECRET') || 'YOUR_SECRET_KEY',
//     });
//   }

//   async validate(payload: any) {
//   return { 
//     userId: payload.sub, // ✅ Ensure this matches the ID in your database
//     email: payload.email, 
//     role: payload.role,
//     hospitalId: payload.hospitalId 
//   };
// }
// }



import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HospitalsService } from '../hospitals/hospitals.service'; // 🚀 Import your HospitalsService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private hospitalsService: HospitalsService, // 🚀 Inject the service
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      // Fail fast instead of silently falling back to a guessable default secret
      throw new Error('JWT_SECRET is not set. Refusing to start with an insecure default.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // 1. 🚀 TENANT CHECK: Look up the hospital status in real-time
    const hospital = await this.hospitalsService.findOne(payload.hospitalId);

    // 2. 🚀 BLOCK ACCESS: If hospital is missing or not 'Active'
    if (!hospital || hospital.status?.toUpperCase() !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Access Denied: Your hospital facility is currently inactive.',
      );
    }

    // 3. If Active, return the user context as normal
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role,
      hospitalId: payload.hospitalId 
    };
  }
}