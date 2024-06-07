import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(RoleGuard)
  @Get('')
  async getAllCustomer() {
    try {
      const response = await this.customerService.getAllCustomer();
      return response;
    } catch (err) {
      throw err;
    }
  }
}
