import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretFactory {
  constructor(private configService: ConfigService) {}

  create(key: string, salt = ''): string {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    if (!secretKey) {
      throw new Error(
        `Failed to create a private key for ${key}. Reason: missing SECRET_KEY configuration.`,
      );
    }

    return crypto
      .createHmac('sha256', secretKey)
      .update(`${key}${salt}`)
      .digest('hex');
  }
}
