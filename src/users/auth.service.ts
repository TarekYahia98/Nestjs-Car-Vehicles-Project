import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(email: string, password: string) {
    // See if email is Used in DB
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is Already Used');
    }

    // Hash Users Password
    // Generate Salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password Together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join the hashed result and the salt Together
    const result = salt + '.' + hash.toString('hex');
    // Create New User And Save it to DB
    const user = await this.userService.create(email, result);
    // Return UserData in Cookie To Store in Browser With Unique UserID
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('incorrect password, please try again.');
    }
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.jwt_secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.jwt_secret,
      }),
    };
  }

  async refreshToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.jwt_secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.jwt_secret,
      }),
    };
  }

  async sendMail() {
    this.mailerService.sendMail({
      to: 'tarek.yahia.20080@gmail.com',
      from: 'eng.tarek.yahiia@gmail.com',
      subject: 'complete signup by verifying Email your email',
      text: '',
      html: `<p>Please click on verify email button to complete your signup</p>
    <button> <a href="localhost:3000/Tarek-CarV-API/auth/signin" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 22px; color: 	#454B1B; text-decoration: none; border-radius: 8px;">Verify Email `,
    });
  }
}
