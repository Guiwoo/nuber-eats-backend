import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @IsEmail()
  @Field((type) => String)
  name: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  @IsString()
  ownersName: string;
}
