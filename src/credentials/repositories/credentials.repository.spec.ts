import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CredentialsRepository } from './credentials.repository';
import { Credential, CredentialDocument } from '../schemas/credential.schema';

describe('CredentialsRepository', () => {
  let credentialsRepository: CredentialsRepository;
  let credentialModel: Model<CredentialDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Credential.name),
          useValue: Model,
        },
        CredentialsRepository,
      ],
    }).compile();

    credentialModel = moduleRef.get<Model<CredentialDocument>>(
      getModelToken(Credential.name),
    );
    credentialsRepository = moduleRef.get<CredentialsRepository>(
      CredentialsRepository,
    );
  });

  describe('create', () => {
    it('should fail when api key already exists', () => {
      // arrange
      const spy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() =>
          Promise.reject('duplicate key error collection'),
        );

      // act
      const actual = expect(
        credentialsRepository.create({
          apiKey: 'API_KEY',
          salt: 'SALT',
          status: 'Enable',
        }),
      );

      // assert
      expect(spy).toBeCalledWith({
        apiKey: 'API_KEY',
        salt: 'SALT',
        status: 'Enable',
      });

      return actual.rejects.toMatch(/duplicate key error collection/);
    });

    it('should create a key pair', () => {
      // arrange
      const spy = jest
        .spyOn(credentialModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve({
            apiKey: 'API_KEY',
            salt: 'SALT',
            status: 'Enable',
          }),
        );

      // act
      const actual = expect(
        credentialsRepository.create({
          apiKey: 'API_KEY',
          salt: 'SALT',
          status: 'Enable',
        }),
      );

      // assert
      expect(spy).toBeCalledWith({
        apiKey: 'API_KEY',
        salt: 'SALT',
        status: 'Enable',
      });

      return actual.resolves.toEqual({
        apiKey: 'API_KEY',
        salt: 'SALT',
        status: 'Enable',
      });
    });
  });

  describe('update', () => {
    it('shoud fail when api key does not exists', () => {
      // arrange
      const spy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 0, nModified: 0, ok: 1 });

      // act
      const actual = expect(
        credentialsRepository.update({ apiKey: 'API_KEY', status: 'Enable' }),
      );

      // assert
      expect(spy).toBeCalledWith(
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
      const spy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockRejectedValueOnce('unknow error');

      // act
      const actual = expect(
        credentialsRepository.update({ apiKey: 'API_KEY', status: 'Enable' }),
      );

      // assert
      expect(spy).toBeCalledWith(
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
      const spy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 1, ok: 1 });

      // act
      const actual = expect(
        credentialsRepository.update({ apiKey: 'API_KEY', status: 'Enable' }),
      );

      // assert
      expect(spy).toBeCalledWith(
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
      const spy = jest
        .spyOn(credentialModel, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 0, ok: 1 });

      // act
      const actual = expect(
        credentialsRepository.update({ apiKey: 'API_KEY', status: 'Enable' }),
      );

      // assert
      expect(spy).toBeCalledWith(
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
});
