import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse, RegisterResponse } from './dto/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(@Args('input') input: RegisterInput): Promise<RegisterResponse> {
    await this.authService.register(input.email, input.password);
    
    return { success: true };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    const result = await this.authService.login(
      input.email,
      input.password,
    );

    return {accessToken: result.accessToken};
  }

  @Query(() => String)
  async validateToken(@Args('token') token: string) {
    const payload = await this.authService.validateToken(token);
    return payload.email;
  }
}
