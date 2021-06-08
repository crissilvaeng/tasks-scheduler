import { KeyPair } from './interfaces/keypair.interface';
import { SecretFactory } from './factories/secret.factory';
import { SaltFactory } from './factories/salt.factory';
import { Test } from '@nestjs/testing';
import { CredentialsService } from './credentials.service';
import { KeyPairFactory } from './factories/keypair.factory';
import { CredentialsRepository } from './repositories/credentials.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credential } from './schemas/credential.schema';
import { ConfigService } from '@nestjs/config';

describe('CredentialsService', () => {
  let factory: KeyPairFactory;
  let repository: CredentialsRepository;
  let service: CredentialsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Credential.name),
          useValue: Model,
        },
        KeyPairFactory,
        CredentialsRepository,
        SaltFactory,
        SecretFactory,
        ConfigService,
        CredentialsService,
      ],
    }).compile();

    factory = moduleRef.get<KeyPairFactory>(KeyPairFactory);
    repository = moduleRef.get<CredentialsRepository>(CredentialsRepository);
    service = moduleRef.get<CredentialsService>(CredentialsService);
  });

  describe('create', () => {
    it('should fail when repository raise an error', () => {
      // arrange
      const keyPair: KeyPair = {
        apiKey: 'API_KEY',
        apiSecret: 'API_SECRET',
        salt: 'SALT',
        status: 'Disable',
      };
      const factorySpy = jest
        .spyOn(factory, 'create')
        .mockReturnValueOnce(keyPair);
      const repositorySpy = jest
        .spyOn(repository, 'create')
        .mockRejectedValueOnce(new Error('repository error'));

      // act
      const actual = expect(service.create({}));

      // assert
      expect(factorySpy).toBeCalledWith('Disable');
      expect(repositorySpy).toBeCalledWith(keyPair);
      return actual.rejects.toMatch(/repository error/);
    });

    it('should create a disable credentials key pair', () => {
      // arrange
      const keyPair: KeyPair = {
        apiKey: 'API_KEY',
        apiSecret: 'API_SECRET',
        salt: 'SALT',
        status: 'Disable',
      };
      const factorySpy = jest
        .spyOn(factory, 'create')
        .mockReturnValueOnce(keyPair);
      const repositorySpy = jest
        .spyOn(repository, 'create')
        .mockResolvedValueOnce(keyPair);

      // act
      const actual = expect(service.create({}));

      // assert
      expect(factorySpy).toBeCalledWith('Disable');
      expect(repositorySpy).toBeCalledWith(keyPair);
      return actual.resolves.toEqual(keyPair);
    });

    it('should create a enable credentials key pair', () => {
      // arrange
      const keyPair: KeyPair = {
        apiKey: 'API_KEY',
        apiSecret: 'API_SECRET',
        salt: 'SALT',
        status: 'Enable',
      };
      const factorySpy = jest
        .spyOn(factory, 'create')
        .mockReturnValueOnce(keyPair);
      const repositorySpy = jest
        .spyOn(repository, 'create')
        .mockResolvedValueOnce(keyPair);

      // act
      const actual = expect(service.create({ enable: true }));

      // assert
      expect(factorySpy).toBeCalledWith('Enable');
      expect(repositorySpy).toBeCalledWith(keyPair);
      return actual.resolves.toEqual(keyPair);
    });
  });

  describe('enable', () => {
    it('should fail when repository raise an error', () => {
      // arrange
      const repositorySpy = jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('repository error'));

      // act
      const actual = expect(service.enable('API_KEY'));

      // assert
      expect(repositorySpy).toBeCalledWith({
        apiKey: 'API_KEY',
        status: 'Enable',
      });
      return actual.rejects.toMatch(/repository error/);
    });

    it('should update status from api key', () => {
      // arrange
      const keyPair: KeyPair = {
        apiKey: 'API_KEY',
        status: 'Enable',
      };
      const repositorySpy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(keyPair);

      // act
      const actual = expect(service.enable('API_KEY'));

      // assert
      expect(repositorySpy).toBeCalledWith(keyPair);
      return actual.resolves.toEqual(keyPair);
    });
  });

  describe('disable', () => {
    it('should fail when repository raise an error', () => {
      // arrange
      const repositorySpy = jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('repository error'));

      // act
      const actual = expect(service.disable('API_KEY'));

      // assert
      expect(repositorySpy).toBeCalledWith({
        apiKey: 'API_KEY',
        status: 'Disable',
      });
      return actual.rejects.toMatch(/repository error/);
    });

    it('should update status from api key', () => {
      // arrange
      const keyPair: KeyPair = {
        apiKey: 'API_KEY',
        status: 'Disable',
      };
      const repositorySpy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(keyPair);

      // act
      const actual = expect(service.disable('API_KEY'));

      // assert
      expect(repositorySpy).toBeCalledWith(keyPair);
      return actual.resolves.toEqual(keyPair);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
