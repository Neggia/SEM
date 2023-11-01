import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SemUserService } from '../entities/sem_user.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  providers: [AuthService, LocalStrategy, SemUserService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
