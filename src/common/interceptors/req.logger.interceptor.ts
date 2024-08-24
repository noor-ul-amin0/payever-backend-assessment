import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

export class ReqLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    console.log(`Method: ${method}, URL: ${url}`);
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        );
        return data;
      }),
    );
  }
}
