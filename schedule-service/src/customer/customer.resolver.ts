import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CustomerResponse, CustomersResponse } from './dto/customer-response';
import { BaseResponse } from 'src/common/graphql/base-response';

@Resolver(() => Customer)
@UseGuards(GqlAuthGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => CustomerResponse, { description: "Membuat customer baru" } )
  async createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput): Promise<CustomerResponse> {
    const data = await this.customerService.create(createCustomerInput);
    
    return { 
      success: true, 
      message: 'Customer created successfully', 
      data 
    };
  }

  @Query(() => CustomersResponse, { name: 'customers', description: "Menampilkan semua customer" })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
    @Args('take', { type: () => Int, nullable: true }) take = 10,
  ): Promise<CustomersResponse> {
    const data = await this.customerService.findAll(skip, take);

    return { 
      success: true, 
      message: 'Customers fetched successfully', 
      data 
    };
  }

  @Query(() => Customer, { name: 'customer', description: "Menampilkan customer berdasarkan id" })
  async findOne(@Args('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Mutation(() => CustomerResponse, { description: "Update data customer berdasarkan ID" })
  async updateCustomer(@Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput): Promise<CustomerResponse> {  
    const data = await this.customerService.update(updateCustomerInput.id, updateCustomerInput);

    return { 
      success: true, 
      message: 'Customer updated successfully', 
      data 
    };
  }

  @Mutation(() => BaseResponse, { description: "Menghapus customer berdasarkan ID" })
  async removeCustomer(@Args('id') id: string): Promise<BaseResponse> {
    await this.customerService.remove(id);

    return {
      success: true,
      message: 'Customer deleted successfully'
    }
  }
}
