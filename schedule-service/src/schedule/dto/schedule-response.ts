import { Field, ObjectType } from "@nestjs/graphql";
import { BaseResponse } from "../../common/graphql/base-response";
import { Schedule } from "../entities/schedule.entity";

@ObjectType({ description: "Response list schedule" })
export class SchedulesResponse extends BaseResponse {
  @Field(() => [Schedule])
  data: Schedule[];
}

@ObjectType({ description: "Response single schedule" })
export class ScheduleResponse extends BaseResponse {
  @Field(() => Schedule, { nullable: true })
  data?: Schedule;
}
