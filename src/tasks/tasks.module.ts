import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TasksProcessor } from './tasks.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    BullModule.registerQueue({ name: 'jobs.queue' })
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor]
})
export class TasksModule {}
