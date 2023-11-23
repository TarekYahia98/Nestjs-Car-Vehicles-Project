import {
  Session,
  NotFoundException,
  Body,
  Controller,
  Param,
  Post,
  Get,
  Query,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { request } from 'express';



@Controller('auth')
//  @UseInterceptors(new SerializeInterceptor(UserDto))
@serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  // using Custom Decorator + Interceptor For Getting Currently Signin User
  
  @Get('/users')
  findAllUsers() {
    return this.usersService.findUsers();
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }


  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    // if (!user) {
    //   throw new NotFoundException('User Not Found');
    // }
    return user;
  }

  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }



  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}

// Set Your Color
// Use cookie-session to store Cookies Data in Server and set-Cookie

// @Get('/colors/:color')
// setColor(@Param('color') color: string, @Session() session: any) {
//   session.color = color;
// }

//Use cookie-session to send set-cookies Data as response

// @Get('/colors')
// getColor(@Session() session:any) {
//   return session.color;
// }
