/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((_) => [Restaurant])
  restaurants(@Args("veganOnly") veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation((_) => Boolean)
  createRestaurat(
    @Args("name") name: string,
    @Args("isVegan") isVegan: boolean,
    @Args("address") address: string,
    @Args("ownerName") ownerName: string
  ) {
    return true;
  }
}
