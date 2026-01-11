import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType({ description: "Input untuk membuat customer baru" })
export class CreateCustomerInput {
  @Field({ description: "Nama lengkap customer" })
  @IsString()
  name: string;

  @Field({description: "Email customer (unik)" })
  @IsEmail()
  email: string;
}
