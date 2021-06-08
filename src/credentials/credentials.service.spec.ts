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
      const actual = expect(credentialsService.create('API_KEY', {}));

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
      const actual = expect(credentialsService.create('API_KEY', {}));

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      expect(credentialModelSpy).toBeCalledWith({
        apiKey: 'API_KEY',
        status: 'Disable',
      });

      return actual.rejects.toMatch(/duplicate key error collection/);
    });

    it('should create a disable credentials key pair', () => {
      // arrange
      const configServiceSpy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('SECRET_KEY');
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve({ apiKey: 'API_KEY', status: 'Disable' }),
        );

      // act
      const actual = expect(credentialsService.create('API_KEY', {}));

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      expect(credentialModelSpy).toBeCalledWith({
        apiKey: 'API_KEY',
        status: 'Disable',
      });

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        apiSecret:
          '3783823e89b520104f8ceec4a0606b041ae4daaceda05d6f649ead01e775079b',
        status: 'Disable',
      });
    });

    it('should create a enable credentials key pair', () => {
      // arrange
      const configServiceSpy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('SECRET_KEY');
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve({ apiKey: 'API_KEY', status: 'Enable' }),
        );

      // act
      const actual = expect(
        credentialsService.create('API_KEY', { enable: true }),
      );

      // assert
      expect(configServiceSpy).toBeCalledWith('SECRET_KEY');
      expect(credentialModelSpy).toBeCalledWith({
        apiKey: 'API_KEY',
        status: 'Enable',
      });

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        apiSecret:
          '3783823e89b520104f8ceec4a0606b041ae4daaceda05d6f649ead01e775079b',
        status: 'Enable',
      });
    });
  });

  describe('enable', () => {
    it('shoud fail when api key does not exists', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 0, nModified: 0, ok: 1 });

      // act
      const actual = expect(credentialsService.enable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Enable',
        },
      );

      return actual.rejects.toMatch(/api key not found/);
    });

    it('shoud fail when moongose raises a unknow error', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockRejectedValueOnce(new Error('unknow error'));

      // act
      const actual = expect(credentialsService.enable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Enable',
        },
      );

      return actual.rejects.toMatch(/unknow error/);
    });

    it('shoud update api key status', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 1, ok: 1 });

      // act
      const actual = expect(credentialsService.enable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Enable',
        },
      );

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        status: 'Enable',
      });
    });

    it('shoud ignore update without modification', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 0, ok: 1 });

      // act
      const actual = expect(credentialsService.enable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Enable',
        },
      );

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        status: 'Enable',
      });
    });
  });

  describe('disable', () => {
    it('shoud fail when api key does not exists', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 0, nModified: 0, ok: 1 });

      // act
      const actual = expect(credentialsService.disable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Disable',
        },
      );

      return actual.rejects.toMatch(/api key not found/);
    });

    it('shoud fail when moongose raises a unknow error', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockRejectedValueOnce(new Error('unknow error'));

      // act
      const actual = expect(credentialsService.disable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Disable',
        },
      );

      return actual.rejects.toMatch(/unknow error/);
    });

    it('shoud update api key status', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 1, ok: 1 });

      // act
      const actual = expect(credentialsService.disable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Disable',
        },
      );

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        status: 'Disable',
      });
    });

    it('shoud ignore update without modification', () => {
      // arrange
      const credentialModelSpy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 0, ok: 1 });

      // act
      const actual = expect(credentialsService.disable('API_KEY'));

      // assert
      expect(credentialModelSpy).toBeCalledWith(
        {
          apiKey: 'API_KEY',
        },
        {
          status: 'Disable',
        },
      );

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        status: 'Disable',
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
