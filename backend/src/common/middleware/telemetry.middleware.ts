import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
@Injectable()
export class TelemetryMiddleware implements NestMiddleware{use(req:Request,res:Response,next:NextFunction){res.setHeader('x-request-path',req.path);next()}}
