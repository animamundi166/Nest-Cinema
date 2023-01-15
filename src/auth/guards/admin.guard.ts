import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';

export class OnlyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserDocument }>();
    const user = request.user;

    if (!user.isAdmin) {
      throw new ForbiddenException('You havent rights');
    }

    return user.isAdmin;
  }
}
