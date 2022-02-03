import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType() // for GraphQL
@Entity() // TYPE ORM LET US SAVE ON DB
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((_) => String)
  @Column()
  name: string;

  @Field((_) => Boolean, { defaultValue: true }) //graphql
  @Column({ default: true }) // db
  @IsBoolean() //validation
  @IsOptional() //validation
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}
