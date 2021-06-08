import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { AuthService } from './auth.service';
import { CredentialsRepository } from 'src/credentials/repositories/credentials.repository';
import { SecretFactory } from 'src/credentials/factories/secret.factory';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Credential,
  CredentialSchema,
} from 'src/credentials/schemas/credential.schema';

@Module({
  imports: [
    CredentialsModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  providers: [AuthService, LocalStrategy, CredentialsRepository, SecretFactory],
})
export class AuthModule {}
