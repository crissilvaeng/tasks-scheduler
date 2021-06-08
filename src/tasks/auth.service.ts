import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Credential,
  CredentialDocument,
  CredentialStatus,
} from '../credentials/schemas/credential.schema';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  validate(apiKey: string, apiSecret: string): Promise<void> {
    const expectedApiSecret = crypto
      .createHmac('sha256', this.configService.get<string>('SECRET_KEY'))
      .update(apiKey)
      .digest('hex');
    return new Promise((resolve, reject) => {
      return this.credentialModel
        .findOne({ apiKey })
        .then((credential: CredentialDocument) => {
          if (!credential || credential.status !== CredentialStatus.Enable) {
            return reject();
          }
          if (expectedApiSecret !== apiSecret) {
            return reject();
          }
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
