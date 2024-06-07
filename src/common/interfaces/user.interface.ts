import { ROLE } from '@prisma/client';

export interface IUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  role: ROLE;
}
