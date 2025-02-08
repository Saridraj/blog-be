import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { response } from 'express';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: MongoRepository<User>;

  async register(userData: User) {
    const userVerify = await this.userRepository.find({
      username: userData.username,
    });

    if (userVerify.length == 0) {
      const HashedPassword = await bcrypt.hash(userData.password, 12);
      return await this.userRepository.save({
        username: userData.username,
        password: HashedPassword,
        avatarURL: userData.avatarURL,
        createdAt: Date(),
      });
    } else if (userVerify.length !== 0) {
      const status = response.status(422);
      const msg = (response.statusMessage =
        'This username has already been registered.');
      return status;
    }
  }

  async signIn(userData: User) {
    const userAuthenicated = await this.userRepository.find({
      username: userData.username,
    });
    const doMatch = await bcrypt.compare(
      userData.password,
      userAuthenicated[0].password,
    );
    if (doMatch == false) {
      const status = response.status(404);
      const msg = (response.statusMessage =
        'username or password is incorrect.');
      return status;
    } else if (doMatch == true) {
      const userAuthenicatedInfo = {
        id: userAuthenicated[0].id,
        username: userAuthenicated[0].username,
        avatarURL: userAuthenicated[0].avatarURL,
        token: jwt.sign({ id: userAuthenicated[0].id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      };
      return userAuthenicatedInfo;
    } else {
      const res = response.status(500);
      return res;
    }
  }
}
