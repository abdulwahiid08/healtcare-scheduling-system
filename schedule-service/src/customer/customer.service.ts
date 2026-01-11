import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/common/helpers/prisma-error.helper';

@Injectable()
export class CustomerService {
  constructor(private prisma:PrismaService) {}

  async create(createCustomerInput: CreateCustomerInput) {
    try {
      const customer = this.prisma.customer.create({
        data: createCustomerInput,
      });
      
      return customer;
    } catch (error) {
      handlePrismaError(error, 'Customer');
    }
  }

  async findAll(skip=0, take=10) {
     try {
      if (skip < 0 || take <= 0) {
        throw new BadRequestException('Invalid pagination parameters');
      }
  
      return await this.prisma.customer.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      });
      
    } catch (error) {
      handlePrismaError(error, 'Customer');
    }
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Opps! Customer not found (id: ${id})`);
    }

    return customer;
  }

  async update(id: string, updateCustomerInput: UpdateCustomerInput) {
    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerInput,
      });
    } catch (error) {
      handlePrismaError(error, 'Customer', id);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.customer.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, 'Customer', id);
    }
  }
}
