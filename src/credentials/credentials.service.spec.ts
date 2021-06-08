import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
import { Credential, CredentialDocument } from './schemas/credential.schema';

describe('CredentialsService', () => {
  let configService: ConfigService;
  let credentialsService: CredentialsService;
  let credentialModel: Model<CredentialDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Credential.name),
          useValue: Model,
        },
        ConfigService,
        CredentialsService,
      ],
    }).compile();

    credentialModel = moduleRef.get<Model<CredentialDocument>>(
      getModelToken(Credential.name),
    );
    configService = moduleRef.get<ConfigService>(ConfigService);
    credentialsService = moduleRef.get<CredentialsService>(CredentialsService);
  });

  describe('create', () => {
    it('should fail when secret key in undefined', () => {
      // arrange
      const configServiceSpy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(undefined);

      // act
      const actual = expect(credentialsService.create('API_KEY'));

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      return actual.rejects.toMatch(/missing SECRET_KEY configuration/);
    });

    it('should fail when api key already exists', () => {
      // arrange
      const configServiceSpy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('SECRET_KEY');
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('duplicate key error collection')),
        );

      // act
      const actual = expect(credentialsService.create('API_KEY'));

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      expect(credentialModelSpy).toBeCalledWith({ apiKey: 'API_KEY' });

      return actual.rejects.toMatch(/duplicate key error collection/);
    });

    it('should create a credentials key pair', () => {
      // arrange
      const configServiceSpy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('SECRET_KEY');
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() => Promise.resolve());

      // act
      const actual = expect(credentialsService.create('API_KEY'));

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      expect(credentialModelSpy).toBeCalledWith({ apiKey: 'API_KEY' });

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        apiSecret:
          '3783823e89b520104f8ceec4a0606b041ae4daaceda05d6f649ead01e775079b',
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
