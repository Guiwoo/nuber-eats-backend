import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((_) => Restaurant)
export class RestaurantResolver {
  @Query((_) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation((_) => Boolean)
  createRestaurat(@Args() createRestaurantInput: CreateRestaurantDto) {
    console.log('work ?', createRestaurantInput);
    return true;
  }
}
