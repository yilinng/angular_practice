import { NewUserEntry } from '../types/types';
import User from "../models/user";

const getEntries = () => {
  return null;
};

const addUser = async (entry: NewUserEntry): Promise<NewUserEntry | undefined> => {

  const newUserEntry = {
    ...entry,
  };

  const user = new User(newUserEntry);

  await user.save();

  return newUserEntry;

};

const filterTodofromUser = (id: string, todo: [string]) => {
  try {
    User.updateOne({ _id: id }, {
      $set: { todo }
    });
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    return errorMessage;
  }
};



export default {
  getEntries,
  addUser,
  filterTodofromUser
};