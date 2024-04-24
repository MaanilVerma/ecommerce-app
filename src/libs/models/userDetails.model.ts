export interface UserDetails {
  id?: string;
  name: string;
  email: string;
  verified: boolean;
  otp?: string;
  password: string;
}
