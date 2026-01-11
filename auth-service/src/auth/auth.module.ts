import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // secret: config.get('JWT_SECRET'),
        // signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },

        const secret = config.get('JWT_SECRET');
        const expiresIn = config.get('JWT_EXPIRES_IN');

        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        if (!expiresIn) {
          throw new Error('JWT_EXPIRES_IN is not defined');
        }

         return {
          secret,
          signOptions: {
            expiresIn,
            algorithm: 'HS256'
          },
        };
      },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
