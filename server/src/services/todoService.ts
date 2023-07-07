import { NewTodoEntry, TodoEntry } from '../types/types';
import Todo from "../models/todo";

const getEntries = async (): Promise<TodoEntry[]> => {
  const todos: TodoEntry[] = await Todo.find().populate('user');
 
  return todos;
};

const addTodo = async (entry: NewTodoEntry) => {
  const newTodoEntry = {
    ...entry,
  };

  const todo = new Todo(newTodoEntry) ;

  await todo.save();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return todo;
};

const deleteTodo = (entry: TodoEntry) => {
  const todo: TodoEntry = entry.remove();
  return todo;
};


const findById = async(id: string): Promise<TodoEntry | null> => {
  const entry: TodoEntry | null = await Todo.findById(id);

  return entry;
};
export default {
  getEntries,
  addTodo,
  deleteTodo,
  findById
};