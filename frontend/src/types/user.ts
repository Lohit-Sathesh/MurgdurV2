export type UserRole = 'client' | 'admin';

export type User = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  customerId?: string;
};

export type Address = {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postal: string;
};
