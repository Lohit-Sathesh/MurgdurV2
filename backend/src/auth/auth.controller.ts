import { Controller, Post, Body, Req } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SendEmailOtpDto } from './dto/send-email-otp.dto'
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto'
import { SendPhoneOtpDto } from './dto/send-phone-otp.dto'
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) { return this.auth.register(dto) }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) { return this.auth.login(dto, req.ip ?? 'unknown') }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) { return this.auth.refreshTokens(dto.refreshToken) }

  @Post('send-email-otp')
  sendEmailOtp(@Body() dto: SendEmailOtpDto) { return this.auth.sendEmailOtp(dto.email) }

  @Post('verify-email-otp')
  verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) { return this.auth.verifyEmailOtp(dto.email, dto.code) }

  @Post('send-phone-otp')
  sendPhoneOtp(@Body() dto: SendPhoneOtpDto) { return this.auth.sendPhoneOtp(dto.phone) }

  @Post('verify-phone-otp')
  verifyPhoneOtp(@Body() dto: VerifyPhoneOtpDto) { return this.auth.verifyPhoneOtp(dto.phone, dto.code) }
}