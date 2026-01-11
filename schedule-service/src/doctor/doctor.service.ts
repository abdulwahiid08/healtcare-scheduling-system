import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/helpers/prisma-error.helper';

@Injectable()
export class DoctorService {
  constructor(private prisma:PrismaService) {}

  async create(createDoctorInput: CreateDoctorInput) {
    try {
      const doctor = await this.prisma.doctor.create({
       data: createDoctorInput,
     });
      
      return doctor;
    } catch (error) {
      handlePrismaError(error, 'Doctor');
    }
  }

  async findAll(skip=0, take=10) {
    try {
      if (skip < 0 || take <= 0) {
        throw new BadRequestException('Invalid pagination parameters');
      }
  
      return await this.prisma.doctor.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      });
      
    } catch (error) {
      handlePrismaError(error, 'Doctor');
    }
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (!doctor) {
      throw new NotFoundException(`Opps! Doctor not found (id: ${id})`);
    }

    return doctor;
  }

  async update(id: string, updateDoctorInput: UpdateDoctorInput) {
    try {
      return await this.prisma.doctor.update({
        where: { id },
        data: updateDoctorInput,
      });
    } catch (error) {
      handlePrismaError(error, 'Doctor', id);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.doctor.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, 'Doctor', id);
    }
  }
}
