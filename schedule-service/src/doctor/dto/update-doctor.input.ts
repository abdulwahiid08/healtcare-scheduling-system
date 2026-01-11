import { CreateDoctorInput } from './create-doctor.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({ description: "Input untuk update doctor, ID wajib" })
export class UpdateDoctorInput extends PartialType(CreateDoctorInput) {
  @Field(() => String, { description: "ID doctor yang ingin diupdate" })
  id: string;
}
