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
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepo<T = any> = Partial<Record<keyof Repository<User>, jest.Mock>>;

describe('UserServcie', () => {
  let service: UsersService;
  let userRepo: MockRepo<User>;
  let verificationsRepository: MockRepo<Verification>;
  let mailService: MailService;

  beforeAll(async () => {
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
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
    verificationsRepository = module.get(getRepositoryToken(Verification));
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
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
