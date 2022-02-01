import { ArgsType } from "@nestjs/graphql";

@ArgsType()
export class CreateRestaurantDto {
  name: string;
  isVegan: boolean;
  address: string;
  ownersName: string;
}
