import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [ConsoleModule, TasksModule, MongooseModule.forRoot('mongodb://localhost/nest'), CredentialsModule],
})
export class AppModule {}
