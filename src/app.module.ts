import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { CredentialsModule } from './credentials/credentials.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConsoleModule,
    TasksModule,
    CredentialsModule,
    ConfigModule.forRoot({ envFilePath: '.development.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
