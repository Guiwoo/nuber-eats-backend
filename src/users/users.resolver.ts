import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAccInput, CreateAccOutput } from './dtos/create-acc.dto';
import { User } from './entities/user.entity';
import { UsersService } from './entities/user.service';

@Resolver((_) => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query((_) => Boolean)
  hi() {
    return true;
  }
  @Mutation((returns) => CreateAccOutput)
  async createAccount(
    @Args('input') createAccInput: CreateAccInput,
  ): Promise<CreateAccOutput> {
    try {
      const { ok, error } = await this.userService.createAccount(
        createAccInput,
      );
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
