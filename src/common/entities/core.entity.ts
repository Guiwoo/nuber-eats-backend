import { Field } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class CoreEntity {
  @PrimaryColumn()
  @Field((types) => Number)
  id: number;

  @CreateDateColumn()
  @Field((types) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((types) => Date)
  updateAt: Date;
}
