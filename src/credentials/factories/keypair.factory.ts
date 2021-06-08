import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { KeyPair } from '../interfaces/keypair.interface';
import { SaltFactory } from './salt.factory';
import { SecretFactory } from './secret.factory';

@Injectable()
export class KeyPairFactory {
  constructor(
    private readonly saltFactory: SaltFactory,
    private readonly secretFactory: SecretFactory,
  ) {}

  create(status): KeyPair {
    const apiKey = uuid.v4();
    const salt = this.saltFactory.create();
    const apiSecret = this.secretFactory.create(apiKey, salt);
    return { apiKey, salt, apiSecret, status };
  }
}
