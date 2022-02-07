import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccInput, CreateAccOutput } from './dtos/create-acc.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

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
      return this.userService.createAccount(createAccInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.userService.login(loginInput);
    } catch (error) {
      return { ok: false, error };
    }
  }

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me() {}
}
