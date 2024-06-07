import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ROLE } from '@prisma/client';

export const Admin = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (user?.role == ROLE.ADMIN_MARKET_PLACE)
      return data ? user?.[data] : user;

    throw {
      type: 'Error',
      code: 500,
      message: `You isn't admin system`,
    };
  },
);
