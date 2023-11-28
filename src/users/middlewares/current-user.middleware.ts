//Custom Middleware instead of (current-user.interceptor) to use it before (AdminGuard) processing 

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

// Tell TypeScript This (currentUser) prop for (User instance) is belongs to Req to avoid Error
//( adding currentUser Prop to existing interface )
declare global {
  namespace Express {
interface Request {
  currentUser?: User;
}
  }
}

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
        const user = await this.usersService.findOne(userId);
        req.currentUser = user;
      }
      next();
  }
}
