import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleWare } from './middlewares/current-user.middleware';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      // secret: process.env.jwt_secret,
      signOptions: { expiresIn: '300s' },
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: true,
        auth: {
          user: 'eng.tarek.yahiia@gmail.com', //generated ethereal user From My Account
          pass: 'digs gzhn edps tvxi', //generated ethereal password From Gmail (Auto-generated) To Send Emails
        },
      },
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,

    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
  controllers: [UsersController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleWare).forRoutes('*');
  }
}
