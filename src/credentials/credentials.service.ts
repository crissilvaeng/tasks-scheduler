import { Console, Command } from 'nestjs-console';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credential, CredentialDocument } from './schemas/credential.schema';
import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto'
import { CredentialStatus } from './schemas/credential.schema'

@Console()
export class CredentialsService {

    constructor(@InjectModel(Credential.name) private credentialModel: Model<CredentialDocument>) { }

    @Command({
        command: 'create',
        description: 'create api key'
    })
    async create(): Promise<void> {
        const apiKey = uuidv4()
        const apiSecret = crypto.createHmac('sha256', 'my scret').update(apiKey).digest('hex')
        return new this.credentialModel({ apiKey })
            .save()
            .then(() => {
                console.log(`Api-Key: ${apiKey}`)
                console.log(`Api-Secret: ${apiSecret}`)
            })
            .catch((err) => console.log(err));
    }

    @Command({
        command: 'enable <api-key>',
        description: 'enable api key'
    })
    async enable(apiKey: string): Promise<void> {
        return this.credentialModel.findOneAndUpdate({ apiKey }, { status: CredentialStatus.Enable })
            .exec()
            .then(() => console.log('OK'))
            .catch((err) => console.log(err));
    }

    @Command({
        command: 'disable <api-key>',
        description: 'disable api key'
    })
    async disable(apiKey: string): Promise<void> {
        return this.credentialModel.findOneAndUpdate({ apiKey }, { status: CredentialStatus.Disable })
            .exec()
            .then(() => console.log('OK'))
            .catch((err) => console.log(err));
    }
}
