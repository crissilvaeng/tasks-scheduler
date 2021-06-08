import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SecretFactory } from './secret.factory';

describe('SecretFactory', () => {
  let config: ConfigService;
  let factory: SecretFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService, SecretFactory],
    }).compile();

    config = moduleRef.get<ConfigService>(ConfigService);
    factory = moduleRef.get<SecretFactory>(SecretFactory);
  });

  it('should fail when secret key is undefined', () => {
    // arrange
    const spy = jest.spyOn(config, 'get').mockReturnValueOnce(undefined);

    // act
    const actual = expect(() => {
      factory.create('API_KEY');
    });

    // assert
    actual.toThrow(/missing SECRET_KEY configuration/);
    expect(spy).toBeCalledWith('SECRET_KEY');
  });

  it('should return secret', () => {
    // arrange
    const spy = jest.spyOn(config, 'get').mockReturnValueOnce('SECRET_KEY');

    // act
    const actual = expect(factory.create('API_KEY'));

    // assert
    actual.toEqual(
      '3783823e89b520104f8ceec4a0606b041ae4daaceda05d6f649ead01e775079b',
    );
    expect(spy).toBeCalledWith('SECRET_KEY');
  });

  it('should return secret when has salt', () => {
    // arrange
    const spy = jest.spyOn(config, 'get').mockReturnValueOnce('SECRET_KEY');

    // act
    const actual = expect(factory.create('API_KEY', 'SALT'));

    // assert
    actual.toEqual(
      '0ccae2cdf54eb8f3818523495cfca8755ec176aedb2c29b26e1d87d0164e1ea1',
    );
    expect(spy).toBeCalledWith('SECRET_KEY');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
