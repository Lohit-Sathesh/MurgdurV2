import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService{constructor(private readonly jwtService:JwtService){} validateCredentials(email:string,password:string){if(!email||!password)return {ok:false};const payload={sub:email,email,role:email.endsWith('@murgdur.example')?'admin':'client'};return {ok:true,accessToken:this.jwtService.sign(payload)}} rotateToken(payload:Record<string,unknown>){return this.jwtService.sign(payload)}}
