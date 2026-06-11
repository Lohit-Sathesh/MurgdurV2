import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUser = {
  userId: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator((data: keyof CurrentUser | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: CurrentUser }>();
  const user = request.user;
  return data && user ? user[data] : user;
});
