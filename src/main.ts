import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 클라이언트 HTML 파일의 경로 설정
  app.use(express.static(join(__dirname, '..', 'client')));

  await app.listen(3000);
}
bootstrap();
