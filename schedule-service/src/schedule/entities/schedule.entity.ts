import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Customer } from 'src/customer/entities/customer.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@ObjectType({ description: 'Data Schedule' })
export class Schedule {
    @Field(() => ID, { description: "ID unik schedule, auto-generate UUID" })
  id: string;

  @Field({ description: "Tujuan jadwal/Isi jadwal" })
  objective: string;

  @Field({ description: "Tanggal jadwal" })
  scheduledAt: Date;

  @Field(() => Customer, { description: "ID customer" })
  customer: Customer;

  @Field(() => Doctor, { description: "ID doctor" })
  doctor: Doctor;

  @Field({ description: "Tanggal pembuatan data" })
  createdAt: Date;

  @Field({ description: "Tanggal terakhir update data" })
  updatedAt: Date;
}
