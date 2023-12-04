import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });
    return this.userRepo.save(user);
  }
  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepo.findOneBy({ id });
  }

  async find(email: string) {
    const user = await this.userRepo.find({ where: { email } });
    if (user.length === 0) {
      throw new NotFoundException('Email is Not Found');
    }
    return user;
  }

  async findUsers() {
    const users = await this.userRepo.find();
    return users;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    Object.assign(user, body);
    const scrypt = promisify(_scrypt);
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    user.password = result;
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return this.userRepo.remove(user);
  }
}
