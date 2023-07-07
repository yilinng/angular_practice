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

export type UserInformation = Omit<UserEntry, 'password' | 'id'>;

export type NewUserEntry = Omit<UserEntry, 'id'>;

export type NewTodoEntry = Omit<TodoEntry, 'id'>;


