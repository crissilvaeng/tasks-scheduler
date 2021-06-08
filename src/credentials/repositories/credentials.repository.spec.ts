import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Credential, CredentialDocument } from '../schemas/credential.schema';
import { CredentialsRepository } from './credentials.repository';

describe('CredentialsRepository', () => {
  let repository: CredentialsRepository;
  let model: Model<CredentialDocument>;

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

    model = moduleRef.get<Model<CredentialDocument>>(
      getModelToken(Credential.name),
    );
    repository = moduleRef.get<CredentialsRepository>(CredentialsRepository);
  });

  describe('create', () => {
    it('should fail when api key already exists', () => {
      // arrange
      const spy = jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() =>
          Promise.reject('duplicate key error collection'),
        );

      // act
      const actual = expect(
        repository.create({
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
      const spy = jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          apiKey: 'API_KEY',
          salt: 'SALT',
          status: 'Enable',
        }),
      );

      // act
      const actual = expect(
        repository.create({
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
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({ n: 0, nModified: 0, ok: 1 });

      // act
      const actual = expect(
        repository.update({ apiKey: 'API_KEY', status: 'Enable' }),
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
        .spyOn(model, 'updateOne')
        .mockRejectedValueOnce('unknow error');

      // act
      const actual = expect(
        repository.update({ apiKey: 'API_KEY', status: 'Enable' }),
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
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 1, ok: 1 });

      // act
      const actual = expect(
        repository.update({ apiKey: 'API_KEY', status: 'Enable' }),
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
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({ n: 1, nModified: 0, ok: 1 });

      // act
      const actual = expect(
        repository.update({ apiKey: 'API_KEY', status: 'Enable' }),
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
