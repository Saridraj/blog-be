import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]),  ConfigModule.forRoot({ isGlobal: true})],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule{}
