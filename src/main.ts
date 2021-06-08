import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as cors from 'cors';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.use(compression());
  app.use(helmet());
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
