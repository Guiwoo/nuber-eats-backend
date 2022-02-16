import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType() // for GraphQL
@Entity() // TYPE ORM LET US SAVE ON DB
export class Category extends CoreEntity {
  @Field((_) => String)
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [Restaurant], { nullable: true })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
