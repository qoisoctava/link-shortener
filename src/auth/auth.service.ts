import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Mengecek apakah email existing?
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exist!');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
    const user = await this.usersService.create(email, hashedPassword);

    //Generate JWT
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto){
    const {email, password} = loginDto;

    // Find the user email
    const user = await this.usersService.findOneByEmail(email)
    if(!user){
        throw new UnauthorizedException('Invalid Credentials!')
    }

    //Validate user password
    const isPasswordValid = bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new UnauthorizedException('Invalid Password!')
    }

    //Generate JWT
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


}
