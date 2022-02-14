import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Column } from 'typeorm';
import { CreateRestaurantInput } from './create-restaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Number)
  restaurantId: number;
}
// Can change decorator on OmitType OmitType(Restaurant, ['id'],InputType)

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
