import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController{constructor(private readonly usersService:UsersService){} @Get('me') me(){return this.usersService.getProfile('demo@example.com')} @Patch('me') update(@Body() body:{name?:string}){return this.usersService.updateProfile('demo@example.com',body)}}
