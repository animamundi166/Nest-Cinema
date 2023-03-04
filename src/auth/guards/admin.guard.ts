import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';

export class OnlyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserDocument }>();

    if (!user.isAdmin) {
      throw new ForbiddenException('You havent rights');
    }

    return user.isAdmin;
  }
}
