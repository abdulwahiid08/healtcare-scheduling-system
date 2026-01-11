import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [AuthService, GqlAuthGuard],
  exports: [AuthService,GqlAuthGuard],
})
export class AuthModule {}
