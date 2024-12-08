import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
/* import * as clerk from '@clerk/clerk-sdk-node'; */

import { IS_PUBLIC_KEY } from '@/common/decorators';
import { decode } from 'next-auth/jwt';

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers?.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];
    if (!token) return false;
    const secret = process.env.NEXTAUTH_SECRET ?? '';
    if (!secret) return false;
    try {
      // @ts-ignore
      const decoded = await decode({ token, secret, process.env.SALT_KEY });
      if (!decoded) return false;
      request.user = decoded;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } 
}

/* const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  context.getHandler(),
  context.getClass(),
]);

if (isPublic) return true;

const request = context.switchToHttp().getRequest();
const { authorization } = request.headers;

console.log()
console.log(request.query)


const clientToken = getCookie(request.header('cookie'),'__session');
console.log(clientToken)
try {
  await clerkClient.verifyToken(clientToken);
} catch (err) {
  throw new UnauthorizedException('No authorization header '+ err);
}
return true; */

function getCookie(raw: string, name: string): string {
	const nameLenPlus = (name.length + 1);
	return raw
		.split(';')
		.map(c => c.trim())
		.filter(cookie => {
			return cookie.substring(0, nameLenPlus) === `${name}=`;
		})
		.map(cookie => {
			return decodeURIComponent(cookie.substring(nameLenPlus));
		})[0] || null;
}