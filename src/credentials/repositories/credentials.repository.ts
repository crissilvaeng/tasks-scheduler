import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Credential, CredentialDocument } from '../schemas/credential.schema';

import { Injectable } from '@nestjs/common';
import { KeyPair } from '../interfaces/keypair.interface';

@Injectable()
export class CredentialsRepository {
  constructor(
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  create(keyPair: KeyPair): Promise<KeyPair> {
    return this.credentialModel.create({ ...keyPair });
  }

  update(keyPair: KeyPair): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      return this.credentialModel
        .updateOne({ apiKey: keyPair.apiKey }, { status: keyPair.status })
        .then(({ n }) => {
          if (n) {
            return resolve(keyPair);
          }
          return reject('api key not found.');
        })
        .catch((err) => reject(err));
    });
  }
}
