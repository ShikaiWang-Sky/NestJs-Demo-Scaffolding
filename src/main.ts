import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // open-api
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJs Demo API')
    .setDescription('The NestJs Demo API Documentation')
    .setVersion('1.0')
    .addTag('nestjs-demo')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // enable cors
  app.enableCors();
  // server port
  await app.listen(8080);
}
bootstrap();
