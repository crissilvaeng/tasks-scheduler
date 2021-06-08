import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Console, Command } from 'nestjs-console';
import { KeyPair } from './interfaces/keypair.interface';
import { CredentialStatus } from './schemas/credential.schema';
import { Credential, CredentialDocument } from './schemas/credential.schema';

@Console()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  @Command({
    command: 'create <api-key>',
    description: 'create api key',
  })
  create(apiKey: string): Promise<KeyPair> {
    return new Promise(async (resolve, reject) => {
      const secretKey = this.configService.get<string>('SECRET_KEY');
      if (!secretKey) {
        return reject(
          `Failed to create a private key for ${apiKey}. Reason: missing SECRET_KEY configuration.`,
        );
      }
      const apiSecret = crypto
        .createHmac('sha256', secretKey)
        .update(apiKey)
        .digest('hex');
      return await this.credentialModel
        .create({ apiKey })
        .then(() => {
          this.logger.log(`X-API-Key ${apiKey}`);
          this.logger.log(`X-API-Secret ${apiSecret}`);
          return resolve({ apiKey, apiSecret });
        })
        .catch((err) =>
          reject(
            `Failed to create a private key for ${apiKey}. Reason: ${err.message}`,
          ),
        );
    });
  }

  @Command({
    command: 'enable <api-key>',
    description: 'enable api key',
  })
  async enable(apiKey: string): Promise<CredentialDocument> {
    return this.credentialModel
      .findOneAndUpdate(
        { apiKey },
        { status: CredentialStatus.Enable },
        { useFindAndModify: false },
      )
      .exec();
  }

  @Command({
    command: 'disable <api-key>',
    description: 'disable api key',
  })
  async disable(apiKey: string): Promise<CredentialDocument> {
    return this.credentialModel
      .findOneAndUpdate(
        { apiKey },
        { status: CredentialStatus.Disable },
        { useFindAndModify: false },
      )
      .exec();
  }
}
