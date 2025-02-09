import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async register(userData: User) {
    const existingUser = await this.userRepository.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      throw new HttpException(
        'This username has already been registered.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.userRepository.save({
      username: userData.username,
      avatarURL: userData.avatarURL,
      createdAt: new Date(),
    });
  }

  async signIn(userData: User) {
    const user = await this.userRepository.findOne({
      where: { username: userData.username },
    });

    if (!user) {
      throw new HttpException(
        'Username or password is incorrect.',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return {
      id: user.id,
      username: user.username,
      avatarURL: user.avatarURL,
      token,
    };
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }
}
