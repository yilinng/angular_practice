import { TodoEntry } from "../app/types/types";

const mockTodo1: TodoEntry = {
  "title": "test12 title update",
  "user": "649adaa22f7aaa10a87e8c31",
  "updateDate": "2023-06-28T02:10:08.316Z",
  "content": ["test12 content update"],
  "id": "649b968009fdb51208802255"
};

const mockTodo2: TodoEntry = {
  "title": "test11 title11",
  "content": ["test11 content11"],
  "user": "649be2bcb9c5bb23489d3788",
  "updateDate": "2023-06-28T13:18:34.033Z",
  "id": "649c332a39f2a020688c002a"
};

const mockTodo3: TodoEntry = {
  "title": "test title",
  "content": ["test content"],
  "user": "649be2bcb9c5bb23489d3788",
  "updateDate": "2023-07-05T12:39:59.844Z",
  "id": "64a5649fab371f1e44905a0c"
};

const updateMockTodo1: TodoEntry = {
  "title": "test12 title update new",
  "user": "649adaa22f7aaa10a87e8c31",
  "updateDate": "2023-06-28T02:10:08.316Z",
  "content": ["test12 content update new"],
  "id": "649b968009fdb51208802255"
}

const addMockTodo: TodoEntry = {
  "title": "test12 addMockTodo",
  "user": "649adaa22f7aaa10a87e8c31",
  "updateDate": "2023-06-28T02:10:08.316Z",
  "content": ["test12 content addMockTodo"],
  "id": "649b968009fdb51208802255"
}

const mockTodoArray: TodoEntry[] = [mockTodo1, mockTodo2, mockTodo3];

const mockSearchTodoArray: TodoEntry[] = [mockTodo1, mockTodo2];

const mockTodoArrayWithSameUser: TodoEntry[] = [mockTodo1, mockTodo3];

export {
  mockTodo1,
  mockTodo2,
  mockTodo3,
  mockTodoArray,
  updateMockTodo1,
  mockSearchTodoArray,
  mockTodoArrayWithSameUser,
  addMockTodo
}