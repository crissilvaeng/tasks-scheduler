import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CredentialDocument = Credential & Document;

export enum CredentialStatus {
  Enable = 'Enable',
  Disable = 'Disable',
}

@Schema()
export class Credential {
  @Prop({
    unique: true,
    required: true,
    dropDups: true,
  })
  apiKey: string;

  @Prop({
    type: String,
    enum: Object.values(CredentialStatus),
    default: CredentialStatus.Disable,
    required: true,
  })
  status: string;

  @Prop({
    required: false,
  })
  salt: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
