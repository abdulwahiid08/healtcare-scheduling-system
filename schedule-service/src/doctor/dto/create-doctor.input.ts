import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType({ description: "Input untuk membuat doctor baru" })
export class CreateDoctorInput {
  @Field({ description: "Nama lengkap doctor" })
  @IsString()
  name: string;
}
