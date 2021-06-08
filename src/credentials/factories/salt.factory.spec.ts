import { Test } from '@nestjs/testing';
import { SaltFactory } from './salt.factory';

describe('SaltFactory', () => {
  let factory: SaltFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SaltFactory],
    }).compile();

    factory = moduleRef.get<SaltFactory>(SaltFactory);
  });

  it('should return secret when has salt', () => {
    // act
    const actual = expect(factory.create());

    // assert
    actual.toBeDefined();
    actual.toHaveLength(32);
  });
});
