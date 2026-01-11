import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
   constructor(
      private readonly configService: ConfigService,
   ) {}

   async validateToken(token: string) {
    try {
      const urlAuthService = this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3001';
      const response = await axios.post(
        `${urlAuthService}/graphql`,
        {
          query: `
            query ValidateToken($token: String!) {
              validateToken(token: $token)
            }
          `,
          variables: { token },
        },
      );

      return response.data.data.validateToken;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
