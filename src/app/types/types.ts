export interface UserEntry {
  [x: string]: any
  id: string
  email: string
  name: string
  password: string
  signUpDate?: string
  todos?: Array<TodoEntry['id']>
}

export interface TodoEntry {
  [x: string]: any
  id: string
  title?: string
  content?: [string]
  updateDate?: string
  user: string
}

export interface TokenEntry {
  email: string
  refresh_token: string,
}

export interface Email {
  email: string[]
}

export type UserInformation = Omit<UserEntry, 'password' | 'id'>;

export type NewLoginUserEntry = Omit<UserEntry, 'id' | 'name'>;

export type NewTodoEntry = Omit<TodoEntry, 'id'>;




