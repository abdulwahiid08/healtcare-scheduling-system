import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
