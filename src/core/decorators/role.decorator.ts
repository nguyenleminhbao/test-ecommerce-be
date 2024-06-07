import { Reflector } from '@nestjs/core';
import { ROLE } from '@prisma/client';

export const Role = Reflector.createDecorator<ROLE>();
