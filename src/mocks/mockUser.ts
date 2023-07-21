import { UserEntry } from "../app/types/types";

const mockUser : UserEntry = {
  id: '1234567678',
  email: '123@123.com',
  name: '123123',
  password:'123123'
}

const mockEmails = {
  "email": [
    "test12@test.com",
    "test123@test.com",
    "test11@test.com",
    "test14@test.com",
    "test15@test.com",
    "test16@test.com",
    "test17@test.com",
    "test18@test.com",
    '123@123.com'
  ]
}

const mockLogin = {
  addTokenEntry: {
    accessToken: '123345676789999',
    refreshToken: 'qazedccgthhjjkklesssss'
  },
  user: {
    email: '123@123.com',
    id: '123445567',
    name: 'test name',
    signUpDate: "2023-06-28T07:35:24.805Z",
    todos: []
  }

};

const mockUserDetails = {
  email: '123@123.com',
  id: '649adaa22f7aaa10a87e8c31',
  name: 'test name',
  signUpDate: "2023-06-28T07:35:24.805Z",
  todos: ['649b968009fdb51208802255']
}

export {
  mockUser,
  mockEmails,
  mockLogin,
  mockUserDetails
}