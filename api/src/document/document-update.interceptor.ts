import {
  Injectable, NestInterceptor, CallHandler, UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentUpdateInterceptor implements NestInterceptor {
  intercept(context: any, next: CallHandler): Observable<any> {
    const { user } = context.getRequest();

    if (!user) {
      throw new UnauthorizedException('You are not authorized to update documents');
    }

    const { body } = context.getRequest();

    delete body.author_id;

    return next.handle();
  }
}
