import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Authorize implements CanActivate {
  async canActivate(ExecutionContext) {
    if (ExecutionContext.args[0].headers.authorization === undefined) {
      return false;
    }
    const token = ExecutionContext.args[0].headers.authorization.split(' ')[1];
    console.log(token);
    let accessType;
    try {
      const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
      if (tokenVerify) {
        accessType = true;
      }
    } catch (error) {
      console.log(error);
      accessType = false;
    }
    return accessType;
  }
}
