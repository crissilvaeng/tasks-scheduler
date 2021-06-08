import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SaltFactory {
  create(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
