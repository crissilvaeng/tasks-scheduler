import { ConsoleModule as CommanderModule } from 'nestjs-console';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [
    CommanderModule,
    CredentialsModule,
    ConfigModule.forRoot({ envFilePath: '.development.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ConsoleModule {}
