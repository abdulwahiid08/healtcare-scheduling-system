import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
