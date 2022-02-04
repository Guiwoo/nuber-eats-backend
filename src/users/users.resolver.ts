import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './entities/user.service';

@Resolver((_) => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query((_) => Boolean)
  hi() {
    return true;
  }
}
