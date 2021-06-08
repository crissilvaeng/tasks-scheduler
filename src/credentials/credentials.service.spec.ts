import { Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
import {
  Credential,
  CredentialDocument,
} from './schemas/credential.schema';

describe('CredentialsService', () => {
  const MOCK_API_KEY = 'API_KEY';
  const MOCK_SECRET_KEY = 'SECRET_KEY';

  let configService: ConfigService;
  let credentialsService: CredentialsService;
  let credentialModel: Model<CredentialDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Credential.name),
          useValue: credentialModel,
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
    it('should fail when secret key in undefined', async () => {
      const spy = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(undefined);
      await expect(
        credentialsService.create(MOCK_API_KEY),
      ).rejects.toThrowError(/argument must be of type string/);
      expect(spy).toBeCalled();
    });
    it('should create key pair', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce(MOCK_SECRET_KEY);
      await expect(credentialsService.create(MOCK_API_KEY)).resolves.toEqual(
        {},
      );
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
