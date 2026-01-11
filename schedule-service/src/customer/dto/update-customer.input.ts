import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({ description: "Input untuk update customer, ID wajib" })
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => String, { description: "ID customer yang ingin diupdate" })
  id: string
}
