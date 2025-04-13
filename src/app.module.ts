import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityController } from './security/security.controller';
import { SecurityModule } from './security/security.module';
import { DbModule } from './config/db.module';
import { EnvConfigModule } from './config/env-config.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [SecurityModule, DbModule, EnvConfigModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
