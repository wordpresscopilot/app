import { CoreMessage } from 'ai';

export interface WpSite {
  id: string;
  user_id: string;
  name: string;
  base_url: string;
  api_key: string;
  connected: boolean;
  created_at: Date;
  updated_at: Date;
}

export type SiteHealthStatus = 'connected' | 'disconnected' | 'checking'


export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}
