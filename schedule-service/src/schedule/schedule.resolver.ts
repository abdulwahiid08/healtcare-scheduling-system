import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { ScheduleResponse, SchedulesResponse } from './dto/schedule-response';
import { BaseResponse } from 'src/common/graphql/base-response';

@Resolver(() => Schedule)
@UseGuards(GqlAuthGuard)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => ScheduleResponse, {description: 'Membuat schedule baru' })
  async createSchedule(@Args('createScheduleInput') createScheduleInput: CreateScheduleInput): Promise<ScheduleResponse> {
    const data = await this.scheduleService.create(createScheduleInput);

    return { 
      success: true, 
      message: 'Schedule created successfully', 
      data 
    };
  }

  @Query(() => [SchedulesResponse], { name: 'schedules', description: 'Menampilkan semua schedule' })
  async findAll(
    @Args('doctorId', { nullable: true }) doctorId?: string,
    @Args('customerId', { nullable: true }) customerId?: string,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
    @Args('take', { type: () => Int, nullable: true }) take = 10,
  ): Promise<SchedulesResponse> {
    const filter = {
      ...(doctorId && { doctorId }),
      ...(customerId && { customerId }),
    };

    const data = await this.scheduleService.findAll(filter, skip, take);

    return { 
      success: true, 
      message: 'Schedules fetched successfully', 
      data 
    };
  }

  @Query(() => Schedule, { name: 'schedule', description: 'Menampilkan schedule berdasarkan id' })
  async findOne(@Args('id') id: string): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Mutation(() => ScheduleResponse, { description: 'Mengubah schedule berdasarkan id' })
  async updateSchedule(@Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput): Promise<ScheduleResponse> {
    const data = await this.scheduleService.update(updateScheduleInput.id, updateScheduleInput);
    
    return {
      success: true,
      message: 'Schedule updated successfully',
      data
    }
  }

  @Mutation(() => BaseResponse, { description: 'Menghapus schedule berdasarkan id' })
  async removeSchedule(@Args('id') id: string): Promise<BaseResponse> {
    await this.scheduleService.remove(id);

    return {
      success: true,
      message: 'Schedule deleted successfully'
    }
  }
}
