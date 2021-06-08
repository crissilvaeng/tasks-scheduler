import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
import { KeyPairFactory } from './factories/keypair.factory';
import { SaltFactory } from './factories/salt.factory';
import { SecretFactory } from './factories/secret.factory';
import { CredentialsRepository } from './repositories/credentials.repository';
import { Credential, CredentialSchema } from './schemas/credential.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  providers: [
    CredentialsService,
    SaltFactory,
    SecretFactory,
    CredentialsRepository,
    KeyPairFactory,
  ],
})
export class CredentialsModule {}
