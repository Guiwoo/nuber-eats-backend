import { Field } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
