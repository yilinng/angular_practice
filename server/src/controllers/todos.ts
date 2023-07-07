import express, { Request, Response, NextFunction } from 'express';
const todosRouter = express.Router();
import Todo from "../models/todo";
import User from '../models/user';
import { TodoEntry, UserEntry } from '../types/types';
import { tokenExtractor, userExtractor } from '../utils/middleware';
import todoService from '../services/todoService';
//import userService from '../services/userService';


export interface TodoRequest extends Request {
  todo?: TodoEntry
  user?: UserEntry
  params: {
    id: string
  }
}

//https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
// Getting all user's todo
todosRouter.get("/", (req: TodoRequest, res: Response) => {

  //console.log('req.query', req.query);

  //const todos = await Todo.find().populate('user');
  void todoService.getEntries()
    .then(todos => {
      if (isObjectEmpty(req.query)) {
       return res.status(200).json(todos);
      }
      //https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
      const title = req.query.title as string;
     
      const filteredByTitle = todos.filter(todo => todo.title?.match(title));

      //console.log('filteredByTitle', filteredByTitle);
      
      return res.status(200).json(filteredByTitle);
    });
});

todosRouter.get('/:id', getTodo, (req: TodoRequest, res: Response) => {
  const todo = req.todo;
  console.log('req.param', req.params, todo);
  if (todo === null) return res.status(404).json({ error: 'todo does not exist' });
  res.json(todo);
});



// Creating one
todosRouter.post("/", tokenExtractor, userExtractor, async (req: TodoRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    console.log('req.user not found');
    return null;
  }

  const todoEntry = await todoService.addTodo({
    title: req.body.title,
    content: req.body.content,
    user: user?._id
  });

  if ('todos' in user) {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    user.todos = user.todos && user.todos.concat(todoEntry._id);
  } else {
    user['todos'] = [todoEntry._id];
  }

  try {

    const updateUser = await User.updateOne(
      { email: user.email },
      {
        $set: {
          todos: user.todos,
        },
      }
    );

    res.status(201).json({ todo: todoEntry, updateUser });
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});


// Updating One
todosRouter.patch("/:id", tokenExtractor, userExtractor, async (req: TodoRequest,
  res: Response) => {

  const user = req.user;

  if (!user) {
    console.log('req.user not found');
    return null;
  }

  try {
    const todo = await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Deleting One
todosRouter.delete("/:id", tokenExtractor, userExtractor, getTodo, async (req: TodoRequest,
  res: Response) => {

  const user = req.user;

  if (!user) {
    console.log('req.user not found');
    return null;
  }

  const todo = req.todo;

  if (!todo) {
    console.log('todo not found');
    return null;
  }


  if (todo.user.toString() === user._id.toString()) {

    try {
      const filteredTodos = user.todos && user.todos.filter(
        (item: { toString: () => string; }) => item.toString() !== req.params.id
      );
      console.log('filteredTodos', filteredTodos);


      const userUpdate = await User.updateOne({ _id: user.id }, {
        $set: { todos: filteredTodos }
      });

      //const userUpdate = userService.filterTodofromUser({ id: user.id, todo: filteredTodos });

      const todoEntry = todoService.deleteTodo(todo);

      res.status(200).json({ todoEntry, user: userUpdate });

    } catch (e) {
      console.log(e);
    }

  }
});

function getTodo(req: TodoRequest,
  res: Response,
  next: NextFunction) {

  void todoService.findById(req.params.id).then((todo) => {

    if (todo === null) {
      return res.status(404).json({ message: 'not found. please input correct id.' });
    }
    req.todo = todo;
    next();

  });

}

//https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
function isObjectEmpty(objectName: any) {
  return JSON.stringify(objectName) === "{}";
}

export default todosRouter;