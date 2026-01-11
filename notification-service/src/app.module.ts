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
          host: 'redis',
          port: 6379,
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
