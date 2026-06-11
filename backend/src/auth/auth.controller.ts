import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController{constructor(private readonly authService:AuthService){} @Post('validate') validate(@Body() body:{email:string;password:string}){return this.authService.validateCredentials(body.email,body.password)}}
