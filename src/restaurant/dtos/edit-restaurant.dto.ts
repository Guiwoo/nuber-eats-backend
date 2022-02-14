import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateRestaurantInput } from './create-restaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {}
// Can change decorator on OmitType OmitType(Restaurant, ['id'],InputType)

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
