import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: User) {
    const register = await this.authService.register(userData);
    return register;
  }

  @Post('signIn')
  async signIn(@Body() userData: User) {
    const data = await this.authService.signIn(userData);
    return data;
  }

  @Get()
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return users;
  }
}
