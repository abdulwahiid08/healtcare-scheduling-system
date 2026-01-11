import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: "Data Doctor" })
export class Doctor {
  @Field(() => ID, { description: "ID unik doctor, auto-generate UUID" })
  id: string;

  @Field({ description: "Nama lengkap doctor" })
  name: string;

  @Field({ description: "Tanggal pembuatan data" })
  createdAt: Date;

  @Field({ description: "Tanggal terakhir update data" })
  updatedAt: Date;
}
