import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { handlePrismaError } from 'src/common/helpers/prisma-error.helper';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma:PrismaService,
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}

  private async checkCustomerExists(customerId: string): Promise<void> {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new BadRequestException(`Opps! Customer not found (id: ${customerId})`);
      }
    }

  private async checkDoctorExists(doctorId: string): Promise<void> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new BadRequestException(`Opps! Doctor not found (id: ${doctorId})`);
    }
  }

  private async checkConflictSchedule(
    doctorId: string, 
    scheduledAt: Date | string,
    excludeScheduleId?: string
  ): Promise<void> {
    const conflict = await this.prisma.schedule.findFirst({
      where: {
        doctorId,
        scheduledAt,
        NOT: excludeScheduleId ? { id: excludeScheduleId } : undefined,
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'Doctor already has a schedule at this time',
      );
    }
  }

  async create(createScheduleInput: CreateScheduleInput) {
    try {
      // CHECK APAKAH CUSTOMER EXIST
      await this.checkCustomerExists(createScheduleInput.customerId);

      // CHECK APAKAH DOCTOR EXIST
      await this.checkDoctorExists(createScheduleInput.doctorId);

      // CHECK APAKAH SCHEDULE CONFLICT
      await this.checkConflictSchedule(
        createScheduleInput.doctorId,
        createScheduleInput.scheduledAt
      )

      // CREATE SCHEDULE
      const schedule = await this.prisma.schedule.create({
        data: createScheduleInput,
        include: {
          customer: true,
          doctor: true,
        },
      })

      // SEND EMAIL 
      await this.emailQueue.add('send-email', {
        to: schedule.customer.email,
        subject: 'Schedule Created',
        text: `Your schedule with ${schedule.doctor.name} is confirmed at ${schedule.scheduledAt}`,
      });
  
      return schedule;
    } catch (error) {
      handlePrismaError(error, 'Schedule');
    }
  }

   async findAll(filter: any = {}, skip = 0, take = 10) {
    try {
      if (skip < 0 || take <= 0) {
         throw new BadRequestException('Invalid pagination parameters');
       }  
 
      return await this.prisma.schedule.findMany({
       where: filter,
       skip,
       take,
       include: {
         customer: true,
         doctor: true,
       },
       orderBy: {
         scheduledAt: 'asc',
       },
     });
    } catch (error) {
      handlePrismaError(error, 'Schedule');
    }
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { customer: true, doctor: true },
    });
    if (!schedule) {
      throw new BadRequestException(`Opps! Schedule not found (id: ${id})`);
    }

    return schedule;
  }

  async update(id: string, updateScheduleInput: UpdateScheduleInput) {
    try {
      
      // CHECK SCHEDULE EXIST
      const existingSchedule = await this.prisma.schedule.findUnique({
        where: { id },
      });
      if (!existingSchedule) {
        throw new BadRequestException('Opps! Schedule not found (id: ${id})');
      }
  
      // CHECK CUSTOMER EXIST
      if (updateScheduleInput.customerId) {
        await this.checkCustomerExists(updateScheduleInput.customerId);
      }
      // CHECK DOCTOR EXIST
      if (updateScheduleInput.doctorId) {
        await this.checkDoctorExists(updateScheduleInput.doctorId);
      }
  
      // CEK KONFLIK JADWAL
      const doctorId =
        updateScheduleInput.doctorId ?? existingSchedule.doctorId;
      const scheduledAt =
        updateScheduleInput.scheduledAt ?? existingSchedule.scheduledAt;
  
      await this.checkConflictSchedule(doctorId, scheduledAt, id);
     
      const updatedSchedule = await this.prisma.schedule.update({
      where: { id },
      data: updateScheduleInput,
      include: {
        customer: true,
        doctor: true,
      },
    });

      // SEND EMAIL 
      await this.emailQueue.add('send-email', {
        to: updatedSchedule.customer.email,
        subject: 'Schedule Updated',
        text: `Your schedule with ${updatedSchedule.doctor.name} is updated at ${updatedSchedule.scheduledAt}`,
      });

      // UPDATE SCHEDULE
      return updatedSchedule;
    } catch (error) {
      handlePrismaError(error, 'Schedule', id);
    }
  }

 async remove(id: string) {
  try {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { customer: true, doctor: true },
    });
    if (!schedule) {
      throw new BadRequestException(`Opps! Schedule not found (id: ${id})`);
    }

    const deleteSchedule = await this.prisma.schedule.delete({
      where: { id },
    });

    await this.emailQueue.add('send-email', {
      to: schedule.customer.email,
      subject: 'Schedule Cancelled',
      text: `Your schedule has been cancelled`,
    });

     return deleteSchedule;
    
  } catch (error) {
    handlePrismaError(error, 'Schedule', id);
  }
  }
}
