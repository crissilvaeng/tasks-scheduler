import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SaltFactory {
  create(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
