import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwaggerSetting } from './swagger/swawgger.setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setSwaggerSetting(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
