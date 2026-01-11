import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
      // CONFIG MODULE SETUP
      ConfigModule.forRoot({
        isGlobal: true,
      }),

      BullModule.forRoot({
        redis: {
          host: process.env.REDIS_HOST,
          port: (process.env.REDIS_PORT ?? 6379) as number,
        },
      }),

      BullModule.registerQueue({
        name: 'email-queue',
      }),
],
  controllers: [AppController],
  providers: [AppService, NotificationProcessor],
})
export class AppModule {}
