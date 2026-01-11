import { Field, ObjectType } from "@nestjs/graphql";
import { BaseResponse } from "../../common/graphql/base-response";
import { Doctor } from "../entities/doctor.entity";

@ObjectType({ description: "Response list doctor" })
export class DoctorsResponse extends BaseResponse {
  @Field(() => [Doctor])
  data: Doctor[];
}

@ObjectType({ description: "Response single doctor" })
export class DoctorResponse extends BaseResponse {
  @Field(() => Doctor, { nullable: true })
  data?: Doctor;
}
