import { Field, ObjectType } from "@nestjs/graphql";
import { BaseResponse } from "../../common/graphql/base-response";
import { Customer } from "../entities/customer.entity";

@ObjectType({ description: "Response list customer" })
export class CustomersResponse extends BaseResponse {
  @Field(() => [Customer])
  data: Customer[];
}

@ObjectType({ description: "Response single customer" })
export class CustomerResponse extends BaseResponse {
  @Field(() => Customer, { nullable: true })
  data?: Customer;
}
