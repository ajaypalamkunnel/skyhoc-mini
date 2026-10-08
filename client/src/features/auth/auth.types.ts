export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
}