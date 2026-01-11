import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  argon2  from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    // CHECK APAKAH EMAIL SUDAH TERDAFTAR
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await argon2.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(email: string, password: string) {
    // GET USER BY EMAIL
    const getOneUser = await this.prisma.user.findUnique({ where: { email } });
    if (!getOneUser) throw new UnauthorizedException('Invalid email or password');
  
    const verifyPass = await argon2.verify(getOneUser.password, password);
    if (!verifyPass) throw new UnauthorizedException('Invalid email or password');

    const payload:JwtPayload = { sub: getOneUser.id, email: getOneUser.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      return {userId: payload.sub, email: payload.email};
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
