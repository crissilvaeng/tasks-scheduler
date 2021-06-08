import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { KeyPairFactory } from './keypair.factory';
import { SaltFactory } from './salt.factory';
import { SecretFactory } from './secret.factory';

describe('KeyPairFactory', () => {
  let saltFactory: SaltFactory;
  let secretFactory: SecretFactory;
  let keyPairFactory: KeyPairFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService, SaltFactory, SecretFactory, KeyPairFactory],
    }).compile();

    saltFactory = moduleRef.get<SaltFactory>(SaltFactory);
    secretFactory = moduleRef.get<SecretFactory>(SecretFactory);
    keyPairFactory = moduleRef.get<KeyPairFactory>(KeyPairFactory);
  });

  it('should create a key pair', () => {
    // arrange
    const saltFactorySpy = jest
      .spyOn(saltFactory, 'create')
      .mockReturnValueOnce('SALT');
    const secretFactorySpy = jest
      .spyOn(secretFactory, 'create')
      .mockReturnValueOnce('API_SECRET');

    // act
    const result = keyPairFactory.create('STATUS');
    const actual = expect(result);

    // assert
    actual.toMatchObject({
      apiSecret: 'API_SECRET',
      salt: 'SALT',
      status: 'STATUS',
    });
    expect(saltFactorySpy).toBeCalled();
    expect(secretFactorySpy).toBeCalledWith(result.apiKey, 'SALT');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
