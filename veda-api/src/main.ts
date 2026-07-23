import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true }); // rawBody needed for Razorpay webhook signature verification

  // ✅ ENABLE GLOBAL VALIDATION
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    forbidNonWhitelisted: true 
  }));

  // ✅ CORS: explicit allowlist instead of reflecting every calling origin.
  // Set FRONTEND_URL in your env (comma-separated for multiple, e.g. prod + staging).
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3001')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server) with no Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🚀 FIX: Let Render assign the port automatically, fallback to 3000 locally
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();