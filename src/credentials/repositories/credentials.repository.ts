import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyPair } from '../interfaces/keypair.interface';
import { Credential, CredentialDocument } from '../schemas/credential.schema';

@Injectable()
export class CredentialsRepository {
  constructor(
    @InjectModel(Credential.name)
    private readonly credentialModel: Model<CredentialDocument>,
  ) {}

  create(keyPair: KeyPair): Promise<KeyPair> {
    return this.credentialModel.create({ ...keyPair });
  }

  retrieve(keyPair: KeyPair): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      return this.credentialModel
        .findOne({ apiKey: keyPair.apiKey, status: keyPair.status })
        .then((data) => {
          if (data) {
            return resolve({ ...data });
          }
          return reject('api key not found');
        })
        .catch((err) => reject(err));
    });
  }

  update(keyPair: KeyPair): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      return this.credentialModel
        .updateOne({ apiKey: keyPair.apiKey }, { status: keyPair.status })
        .then(({ n }) => {
          if (n) {
            return resolve(keyPair);
          }
          return reject('api key not found');
        })
        .catch((err) => reject(err));
    });
  }
}
