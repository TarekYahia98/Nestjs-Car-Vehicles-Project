import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

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
  }

