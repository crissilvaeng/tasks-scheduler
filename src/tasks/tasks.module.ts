import { Module, HttpModule } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { BullModule } from '@nestjs/bull';
import { TasksProcessor } from './tasks.processor';
import {
  Credential,
  CredentialSchema,
} from '../credentials/schemas/credential.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({ name: 'jobs.queue' }),
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor],
})
export class TasksModule {}
