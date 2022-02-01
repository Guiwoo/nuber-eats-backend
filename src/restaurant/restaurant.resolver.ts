import { Body } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((_) => Restaurant)
export class RestaurantResolver {
  @Query((_) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation((_) => String)
  createRestaurat(@Args() createRestaurantInput: CreateRestaurantDto) {
    console.log(createRestaurantInput);
    return 'Added a new Restaurant';
  }
}
