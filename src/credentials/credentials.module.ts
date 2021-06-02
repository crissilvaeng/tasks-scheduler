import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { Credential, CredentialSchema } from './schemas/credential.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Credential.name, schema: CredentialSchema }])],
  providers: [CredentialsService]
})
export class CredentialsModule {}
