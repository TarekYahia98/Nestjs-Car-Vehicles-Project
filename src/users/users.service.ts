import {
  NotFoundException,
  Injectable,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  find(email: string) {
    return this.userRepo.find({ where: { email } });
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
