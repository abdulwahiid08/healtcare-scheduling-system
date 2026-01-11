import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppResolver } from './graphql/app.resolver';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BullModule } from '@nestjs/bull';
// import { redisStore } from 'cache-manager-redis-store';
// import { CacheModule } from 'cache-manager';

@Module({
  imports: [
    // CONFIG MODULE SETUP
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // GRAPHQL MODULE SETUP
      GraphQLModule.forRootAsync<ApolloDriverConfig>({
        imports: [ConfigModule],
        inject: [ConfigService],
        driver: ApolloDriver,
        useFactory: (config: ConfigService) => ({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: config.get('NODE_ENV') !== 'production',
          introspection: config.get('NODE_ENV') !== 'production',

          context: ({ req }) => ({ req }),
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            };
          },
        }),
    }),

    // BULL MODULE
     BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: (process.env.REDIS_PORT ?? 6379) as number,
      },
    }),

    // CacheModule.register({
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: (process.env.REDIS_PORT ?? 6379) as number,
    // }),

    // MODULES FEATURES
    PrismaModule,
    AuthModule,
    CustomerModule,
    DoctorModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, AuthService],
})
export class AppModule {}
