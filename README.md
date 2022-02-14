# Nuber Eats

- The Backend of Nuber Eats Clone

## NestJS

- AppModule Everthing inside && Main.ts is runnning acutal app

  - Make a Module nest g mo "name"

- Refectoring "Reserver" is just doorman get a input send to service, get ouput and send to gql

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

- [Active Record🎄](https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md) vs [Data Mapper 🎄](https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md#what-is-the-data-mapper-pattern)

- Mapped Types

## User Model

- 1. Create extends Modle ? Module

  - Don't want to repeat id part So Generate one more module for standard
  - extends other module , don't repeat them twice
  - [TypeORM Special Module](https://typeorm.io/#/entities/special-columns)

- 2. Create resolvers, service and Connect on Module

  - 1. Have to type on Imports in Module
       `imports: [TypeOrmModule.forFeature([User])],`
  - 2. Binding Repository in service
       `@InjectRepository(User) private readonly users: Repository<User>,`
  - 3. Binding service to User Resolver
       `constructor(private readonly userService: UsersService) {}
  - 4. Give a provider in Module` `providers: [UsersResolver, UsersService],`

### Create Account

- 3. Mutation and DTO

  - PrevSteps) entity make comfitable to graphQL as well
    - @ObjectType,@InputTtyp({isAbstract:true})
    - Write @Field Section on User Entity
  - PrevSteps) CoreEntity as well

  - Ready to Make a DTO

    ```
    @Mutation((returns) => CreateAccOutput)
    createAccount(@Args('input') createAccInput: CreateAccInput) {}
    ```

    - let them distinguish on input data and output data

      - Input

        - Use own Serviced by [nestJS](https://docs.nestjs.com/openapi/mapped-types#pick)

      - Output
        - Make 2Fields For Error and Ok

- 4. EnumType

  - To DB try to write on Specific number
    - @Column({ type: 'enum', enum: UserRole })
  - Write on GrpahQL as well
    - registerEnumType(UserRole, { name: 'UserRole' });

- 5. CreateAcc on service.ts

  - createAcc has params type of CreateAccInput
  - this.somethig,save this.something.create different
    - can chain it for shorter lines (this.s.save(this.s.create({a,b,c})))

- 6. Hashing Password
  - Using by bcrypt on Entity before saving on database

### Login

- 7. Create reserver,service for login

  - create reserver for login
  - create service for login
  - expend user class for checking hashed password

- 8. Authentication

  - #### Manual Way

    - 1. Json WebToken [Go Check](https://www.npmjs.com/package/jsonwebtoken)

      - Point is not to be secret
      - Valid fro backend verify who we are

    - 2. Create Module for jwt

      - nest g mo jwt
      - nest g s jwt
      - connect to on userService for using global set a decorator on jwt service

    - 3. make forRoot on Static service

    - 4. MiddleWare for getting token from user

      - Same like Express haritance from nextmiddleware use req,res,next
      - after function done have to add next() before closing bracket
      - App module implements nestmodule configure
      - consumer.apply(JwtMiddleware).forRoutes

      - If you wanna apply all routes ?

        - can use app.use(middleware name) on main.ts
        - Not working if you are using class

      - verify that token in headers
      - share the request graphql

        - set a user on header with decoded token
        - in grpahql module add context
        - can call it reservers anywhere @context

          - will call every signle request

        - guard will stop the reqeust [Guard](https://docs.nestjs.com/guards#guards)

## Email Verification

- Use one to one field

  - verifiy from email to User
  - Need to add JoinColumn on email section

- Generate random text

  - [uuid](https://www.npmjs.com/package/uuid)

- Create Verification during create Acc

  - use save code and send user info
  - code ? from entity using beforeinsert "means before saving"

- Edit Profile as well when user changes the email ? need to re-verify email

- If i need to use relation data ? I have to ask typeorm for data

  - codecode.findOne({~},relation:["user"] or read something id will return id )

- OneToOne Field can set a what happend delete { onDelete: 'CASCADE' }

  - Like Django

- Select Flase on Entity so when i login, get error because password is undefined

  - Have to load from database when i call findone function { select: ['password'] } add this one as well

- email template ? suck Use the single email tempalte
  - MailGun or use nestjsEmail

## Test UserModel

- ### .spec.ts

  - Mandatory to testing
  - Unit Testing as much as possible isolate functions

  - 1. describe("UserServcie",function)
  - 2. it.todo(something what you want to test)
  - 3. beforeAll "Getting the service module and offer provider userservice"

  - 1. jest RootDir fixed on json
  - 2. Mock "fake function or class implementaion"

  - 1. Testing function not a outcome from a function

    - every single lines testing
    - Each line of code
    - How our code running
    - Don't care with real data and database

  - 2. Jest can Fake the module as well !

    - jest.mock("jsonwebtoken",fucntion) like this !!

- ### E2E Test

  - Error

    - 1. Cannot find module "need to configure path" in test folder
    - 2. Config Validation "NODE_ENV" Add on joi schema and copy and paste on env.test

  - Make for the test db

    - 1. configure on App module
    - 2. write on same varibles on .env.test
    - 3. make db manually
    - 4. Set afterAll(fn=>app.close())
    - 5. Open db and after testing drop the db make it clear

  - GraphQL reserver test

    - 1. import \* as request from 'supertest' because need to request and post some data
    - 2. request(app.getHttpServer) set a graphql end point and send query
    - 3. query: `` use Backtick it will allow you to use enter between backticks

  - Login Test

    - Make login case and wrong case test both of them
    - query as like graphql just copy from localhost
    - tobe , toEqual is different "check exact same output","Checking type"

  - UseProfile

    - Making a UserRepository
      - let userRepo: Repository<User>;
    - Get a user token from login test
    - const [user] = await userRepo.find();
      - userId = user.id;
    - Find first user and get the id beforeAll() testing in descrbie(userprofile)

  - Me
    - There's an bug on jwtMiddleware findbyid and it returs an object not a user
    - Use jwtToken which we got after loggin in

## Restaurant Model

- name, category, address, coverImage

  - [One to Many](https://typeorm.io/#/undefined/creating-a-many-to-one--one-to-many-relation)

  - @Inputtype can set a name

- ### Restaurant Create

  - Created Dto and check omittype to exclude id,category,owner
  - use PickType instead Omitting on Input
  - Add Category on Restaurant Module can use Category repository
  - Set Create NewRes and set a owner and catoegry

  - Create Decorator for Roles because don't wanna repeat if else a lot
    - AllowedRoles => type of enum's key,vaule
    - keyof typeof UserRoles and setMetadata("role",params)
  - AuthGuard Add on Globally
    - AuthModule add AppGuard as provider and useClass "AuthGurad"
    - add On App Module for using AuthGuard
    - Problems "Some query and mutation is public but is Locked by app guard"
      - Using Role decorator instead AuthGuard
      - check authguard can read roles data if is undefined? it means Public
      - on our guard handle if has a roles , roles has data handling retrun true

- ### Restaurant Read
- ### Restaurant Update
- ### Restaurant Delete
