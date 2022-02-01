# Nuber Eats

- The Backend of Nuber Eats Clone

## NestJS

- AppModule Everthing inside && Main.ts is runnning acutal app
  - Make a Module nest g mo "name"

## GraphQL API

- GraphQLModule.forRoot(), add on AppModule in the module import !
  - Get Error ! Caz need a Schema ! reserver and types !
  - CodeFirst - generate Schema
  - Using @Resolver for making resolver file and query as well (Decorator)
    - @Query Decorator needs to use as well
    - [How to Write Resolver? ](https://docs.nestjs.com/graphql/resolvers)
  - Object Types
    - @ObjectType() and export class
    - @Field means every sigle data on shcema
      - nullable means ? ! on GraphQL
  - Arguments
    - @Args('veganOnly') veganOnly: boolean write on resolver.ts
  - Mutation
    - Using @Args decoratorts pass the args
      - ```
        @Args("argument : name") name :string
        ```
    - How about handle more than 2 args ?
      - @InputType() type of data wanna input one Object
        - ```
          @Filed(type=>String)\n name:string,
          ```
        - But this one needs dirty typing on graplql mutatin{crate(typename:{requried args })}
      - @ArgsType() Send to seperate value not put in a object !!
        - More Clean Code !
