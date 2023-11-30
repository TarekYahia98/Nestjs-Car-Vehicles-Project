import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authservice: AuthService) {
    super();
  }
  async validate(email: string, password: string) {
    const user = await this.authservice.signin(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
