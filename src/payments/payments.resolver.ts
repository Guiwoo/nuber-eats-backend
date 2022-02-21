import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/authuser.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver((of) => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentsService) {}

  @Mutation((returns) => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createInputPayment: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.creaetPayment(owner, createInputPayment);
  }

  @Query((returns) => GetPaymentsOutput)
  @Role(['Owner'])
  getPayment(@AuthUser() user: User): Promise<GetPaymentsOutput> {
    return this.paymentService.getPayment(user);
  }
}
