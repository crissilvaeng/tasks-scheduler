import { CredentialStatus } from './../credentials/schemas/credential.schema';
import { CredentialsRepository } from './../credentials/repositories/credentials.repository';
import { Injectable } from '@nestjs/common';
import { SecretFactory } from 'src/credentials/factories/secret.factory';
import { KeyPair } from 'src/credentials/interfaces/keypair.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: CredentialsRepository,
    private readonly factory: SecretFactory,
  ) {}

  validateToken(apiKey: string, secretKey: string): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      return this.repository
        .retrieve({
          apiKey,
          status: CredentialStatus.Enable,
        })
        .then((keypair) => {
          const apiSecret = this.factory.create(keypair.apiKey, keypair.salt);
          if (secretKey === apiSecret) {
            return resolve(keypair);
          }
          reject('invalid credentials keypair');
        })
        .catch((err) => reject(err));
    });
  }
}
