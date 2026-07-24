import { baseAPI } from './base.api';

export const loginApi = (data: { email:string, password: string }) => (
  baseAPI('/login', 'POST', data)
)