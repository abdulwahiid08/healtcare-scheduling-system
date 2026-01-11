import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { DoctorResponse, DoctorsResponse } from './dto/doctor-response';
import { BaseResponse } from 'src/common/graphql/base-response';

@Resolver(() => Doctor)
@UseGuards(GqlAuthGuard)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => DoctorResponse,  { description: "Membuat doctor baru" })
  async createDoctor(@Args('createDoctorInput') createDoctorInput: CreateDoctorInput): Promise<DoctorResponse> {
    const data = await this.doctorService.create(createDoctorInput);

    return {
      success: true,
      message: 'Doctor created successfully',
      data
    }
  }

  @Query(() => [DoctorsResponse], { name: 'doctors',  description: "Menampilkan semua doctor" })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
    @Args('take', { type: () => Int, nullable: true }) take = 10,
  ): Promise<DoctorsResponse> {
    const data = await this.doctorService.findAll(skip, take);

    return {
      success: true,
      message: 'Doctors fetched successfully',
      data
    }
  }

  @Query(() => Doctor, { name: 'doctor', description: "Menampilkan doctor berdasarkan id"  })
  async findOne(@Args('id') id: string): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Mutation(() => DoctorResponse, { description: "Update data doctor berdasarkan ID" })
  async updateDoctor(@Args('updateDoctorInput') updateDoctorInput: UpdateDoctorInput): Promise<DoctorResponse> {
    const data = await this.doctorService.update(updateDoctorInput.id, updateDoctorInput);

    return {
      success: true,
      message: 'Doctor updated successfully',
      data
    }
  }

  @Mutation(() => BaseResponse, { description: "Menghapus doctor berdasarkan ID" })
  async removeDoctor(@Args('id') id: string): Promise<BaseResponse> {
    await this.doctorService.remove(id);

    return {
      success: true,
      message: 'Doctor deleted successfully'
    }
  }
}
