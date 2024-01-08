// request-logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logMessage = `${this.getClientIp(req)} - ${req.method} ${
      req.originalUrl
    } ${JSON.stringify(req.query)} - ${new Date()}\n`;

    fs.appendFile('logs.txt', logMessage, (err) => {
      if (err) {
        console.error('Error writing to logs.txt:', err);
      }
    });

    next();
  }

  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return forwardedFor.toString().split(',')[0];
    } else {
      return req.connection.remoteAddress || '';
    }
  }
}
