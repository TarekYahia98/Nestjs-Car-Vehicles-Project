import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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

  async sendMail(email: string) {
    this.mailerService.sendMail({
      to: `${email}`,
      from: 'eng.tarek.yahiia@gmail.com',
      subject: 'Verify Your Email',
      text: '',
      html: `<p>Please click on verify email button to complete Verifing Steps</p>
    <button> <a href="Front-End URL" target="_blank" style="display: inline-block; 
    padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    font-size: 22px; color:#454B1B; text-decoration: none; border-radius: 8px;">Verify Email</button> `,
    });
  }

  async forgetPassword(email: string) {
    const payload = { sub: email, email: email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.forget_Password,
        expiresIn: '300s',
      }),
    };
  }


  async resetPassword(body: {newPassword :string}, req: { headers: { authorization: string; }; }){ 
    let token: string;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const user = this.jwtService.decode(token)
    const [userData] = await this.userService.find(user.email)
    const { newPassword } = body
    const scrypt = promisify(_scrypt);
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    userData.password = result;
    await this.userRepo.save(userData);
    return userData;
  } else {
  throw new UnauthorizedException();
  }
  }
}

