import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}
