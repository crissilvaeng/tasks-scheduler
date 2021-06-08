import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { KeyPairFactory } from './factories/keypair.factory';
import { KeyPair } from './interfaces/keypair.interface';
import { CredentialsRepository } from './repositories/credentials.repository';
import { CredentialStatus } from './schemas/credential.schema';

interface Options {
  enable?: boolean;
}

@Console()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly keyPairFactory: KeyPairFactory,
    private readonly credentialsRepository: CredentialsRepository,
  ) {}

  @Command({
    command: 'create',
    description: 'create api key',
    options: [
      {
        flags: '-e, --enable',
        required: false,
      },
    ],
  })
  create(options: Options): Promise<KeyPair> {
    return new Promise(async (resolve, reject) => {
      const status = options.enable
        ? CredentialStatus.Enable
        : CredentialStatus.Disable;
      const keyPair = this.keyPairFactory.create(status);
      return this.credentialsRepository
        .create(keyPair)
        .then((data) => {
          this.logger.log(`X-API-Key ${data.apiKey}`);
          this.logger.log(`X-API-Secret ${keyPair.apiSecret}`);
          this.logger.log(`Status: ${data.status}`);
          return resolve(keyPair);
        })
        .catch((err) =>
          reject(
            `Failed to create a credentials key pair. Reason: ${err.message}`,
          ),
        );
    });
  }

  @Command({
    command: 'enable <api-key>',
    description: 'enable api key',
  })
  enable(apiKey: string): Promise<KeyPair> {
    return this.toggle(apiKey, CredentialStatus.Enable);
  }

  @Command({
    command: 'disable <api-key>',
    description: 'disable api key',
  })
  async disable(apiKey: string): Promise<KeyPair> {
    return this.toggle(apiKey, CredentialStatus.Disable);
  }

  private toggle(apiKey: string, status: CredentialStatus): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      return this.credentialsRepository
        .update({ apiKey, status })
        .then((keypair) => {
          this.logger.log(`X-API-Key ${keypair.apiKey}`);
          this.logger.log(`Status: ${keypair.status}`);
          return resolve(keypair);
        })
        .catch((err) =>
          reject(
            `Failed to update status to ${apiKey}. Reason: ${err.message}`,
          ),
        );
    });
  }
}
