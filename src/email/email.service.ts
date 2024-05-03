import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailForgotPassword(user: User, token: string) {

    const urltoken = `${process.env.HOST_API}/auth/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Notificación de restablecimiento de contraseña',
      template: './reset-password', 
      context: { 
        name: user.fullName,
        urltoken,
      },
    });
  }

  async sendCredentialsToUser(user: CreateUserDto) {

    const url = `${process.env.HOST_API}/auth/login`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Credenciales de acceso',
      template: './user-credentials', 
      context: { 
        name: user.fullName,
        email: user.email,
        password: user.password,
        url: url
      },
    });
  }
}