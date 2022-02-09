import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './user.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-babe'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<User>, jest.Mock>>;

describe('UserServcie', () => {
  let service: UsersService;
  let userRepo: MockRepo<User>;
  let verificationsRepository: MockRepo<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
    verificationsRepository = module.get(getRepositoryToken(Verification));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const craeteArgs = {
      email: '',
      password: '',
      role: 0,
    };

    it('Should Fail if user exist', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'abc',
      });
      const result = await service.createAccount(craeteArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email',
      });
    });

    it('Should create an user', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      userRepo.create.mockReturnValue(craeteArgs);
      userRepo.save.mockResolvedValue(craeteArgs);
      verificationsRepository.create.mockReturnValue({
        user: craeteArgs,
      });
      verificationsRepository.save.mockResolvedValue({
        code: 'code',
      });
      const result = await service.createAccount(craeteArgs);
      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(userRepo.create).toHaveBeenCalledWith(craeteArgs);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(craeteArgs);
      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: craeteArgs,
      });
      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: craeteArgs,
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    it('Sholud fail any error', async () => {
      userRepo.findOne.mockRejectedValue(new Error(''));
      const result = await service.createAccount(craeteArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not create account do it later',
      });
    });
  });
  describe('login', () => {
    const loginArgs = {
      email: 'bs@email.com',
      password: 'bs',
    };
    it('Should fail if user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.login(loginArgs);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'Email does not Exist',
      });
    });
    it('Should fail if the password is wrong', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepo.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });
    it('Should return if password is correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepo.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'signed-token-babe' });
    });
    it('Should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Can not log-in User' });
    });
  });
  describe('findById', () => {
    const findByArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      userRepo.findOneOrFail.mockResolvedValue(findByArgs);
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: true,
        user: findByArgs,
      });
    });
    it('Should fail if no user if found', async () => {
      userRepo.findOneOrFail.mockRejectedValue(new Error(''));
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Does not Exist' });
    });
  });
  describe('editProfile', () => {
    it('Should change email', async () => {
      const oldUser = {
        email: 'b@b.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'n@n.com' },
      };
      const newVerification = {
        code: 'code',
      };
      const newUser = {
        verified: false,
        email: editProfileArgs.input.email,
      };
      userRepo.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);
      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith(editProfileArgs.userId);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationsRepository.save).toHaveBeenCalledWith(
        newVerification,
      );

      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });
    it('Should chage password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: 'new.password' },
      };
      userRepo.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ ok: true });
    });
    it('Should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error(''));
      const result = await service.editProfile(1, { email: '12@12.com' });
      expect(result).toEqual({
        ok: false,
        error: 'Can not update Your Profile',
      });
    });
  });
  it.todo('verifyEmail');
});
