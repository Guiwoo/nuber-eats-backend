import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((types) => Number)
  id: number;

  @CreateDateColumn()
  @Field((types) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((types) => Date)
  updateAt: Date;
}
