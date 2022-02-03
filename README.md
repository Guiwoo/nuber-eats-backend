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

- Validating
  - npm i class-validator
  - add pipline on main.ts done
  - ```
    @IsEmail()
    @Field((type) => String)
    name: string;
    ```

## DataBase Configure

- To Talk to with database from nestJS/TS "ORM Coool to be nicer"

  - TYPE ORM "Mix with TS and nodeJS" (Object Realation Mapper)
  - Can support many platform

- PostgresSQL,Postico "use Home Brew to download"
- Connect Db with nestJS [Check Here](https://docs.nestjs.com/techniques/database#database)

  - npm install --save @nestjs/typeorm typeorm pg

- Using enviroment by [NestJS Configurations](https://docs.nestjs.com/techniques/configuration)

  - Cross-env can use multiple enviroments
  - "start:dev": "cross-env ENV=dev nest start --watch", Setting Package.json file

- Most Powerful schema description language [joi](https://www.npmjs.com/package/joi)
  - How to use on NestJS? [Check Here](https://docs.nestjs.com/techniques/configuration#schema-validation)
  - Give more security running my app

## TypeORM and Sent

- Entity is a class that maps to database table

  - @Entity for save data on db
  - @Field for GraphQL Schema
  - Wanna Edit Field ?
  - Just editting on specific module file

- Just add on TypeModule ,entiti as array
