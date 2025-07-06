import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './utils/env/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.disable('etag');
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const options = new DocumentBuilder()
    .setTitle('OX Group Test API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT);
}

bootstrap().then(() => console.log(`http://0.0.0.0:${PORT}/api/swagger`));
