import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@InputType({ description: "Input untuk membuat customer baru" })
export class CreateScheduleInput {
  @Field({ description: "Tujuan jadwal/Isi jadwal" })
  @IsString()
  objective: string;

  @Field({ description: "ID customer" })
  @IsString()
  customerId: string;

  @Field({ description: "ID doctor" })
  @IsString()
  doctorId: string;

  @Field({ description: "Tanggal jadwal" })
  @IsDate()
  scheduledAt: Date;
}
