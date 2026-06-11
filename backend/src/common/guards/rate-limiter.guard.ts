import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class RateLimiterGuard implements CanActivate{canActivate(_context:ExecutionContext){return true}}
