import { CreateScheduleInput } from './create-schedule.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType({ description: 'Input untuk update schedule, ID Wajib' })
export class UpdateScheduleInput extends PartialType(CreateScheduleInput) {
  @Field(() => String, { description: 'ID schedule yang ingin diupdate' })
  id: string;
}
