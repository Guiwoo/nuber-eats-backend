import { Query, Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/authuser.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation((_) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }

  @Query((_) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrdersInput);
  }

  @Query((_) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.orderService.getOrder(user, getOrderInput);
  }

  @Mutation((_) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput);
  }

  @Mutation((returns) => Boolean)
  potatoReady() {
    pubsub.publish('Potato', { readyPotato: 'Your Potato is Ready Love you' });
    return true;
  }

  @Subscription((returns) => String)
  readyPotato() {
    return pubsub.asyncIterator('Potato');
  }
}
