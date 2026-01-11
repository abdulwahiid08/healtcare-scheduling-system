import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: "Data Customer" })
export class Customer {
  @Field(() => ID , { description: "ID unik customer, auto-generate UUID" })
  id: string;

  @Field({ description: "Nama lengkap customer" })
  name: string;

  @Field({description: "Email customer (unik, opsional)" })
  email: string;

  @Field({ description: "Tanggal pembuatan data" })
  createdAt: Date;

  @Field({ description: "Tanggal terakhir update data" })
  updatedAt: Date;
}
