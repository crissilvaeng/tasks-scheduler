import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CredentialDocument = Credential & Document;

export enum CredentialStatus {
    Enable = 'Enable',
    Disable = 'Disable',
}
  
@Schema()
export class Credential {
    
    @Prop({ required: true })
    apiKey: string;

    @Prop({
        type: String,
        enum: Object.values(CredentialStatus),
        default: CredentialStatus.Disable,
        required: true
    })
    status: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
