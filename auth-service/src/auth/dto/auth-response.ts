import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  success: boolean;
}

