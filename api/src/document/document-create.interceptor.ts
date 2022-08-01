import {
  Injectable, NestInterceptor, CallHandler, UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentCreateInterceptor implements NestInterceptor {
  intercept(context: any, next: CallHandler): Observable<any> {
    const { user } = context.getRequest();

    if (!user) {
      throw new UnauthorizedException('You are not authorized to create documents');
    }

    const { body } = context.getRequest();

    context.getRequest().body = {
      ...body,
      author_id: user.profile_id,
    };

    return next.handle();
  }
}
