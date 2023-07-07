import bcrypt from "bcrypt";
import express, { Request, Response } from 'express';
const signupRouter = express.Router();

import User from "../models/user";

import { UserEntry } from '../types/types';
import { signupValidation } from '../validation';
import userService from '../services/userService';
//import tokenService from '../services/tokenService';

interface UserRequest extends Request {
  user?: UserEntry
}

signupRouter.post("/", async (req: UserRequest, res: Response) => {

  //let's validate the data before we add user
  const { error } = signupValidation(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  //checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ message: 'email already exist!' });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const addUserEntry = await userService.addUser({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  /*
  const addTokenEntry = await tokenService.addToken({
    email: req.body.email,
    password: hashedPassword,
  });


  res.cookie('token', addTokenEntry.accessToken, {
    expires: new Date(Date.now() + 9999999),
    httpOnly: false,
    // Forces to use https in production
    secure: true,
    sameSite: 'none',
  });

  res.cookie('retoken', addTokenEntry.refreshToken, {
    expires: new Date(Date.now() + 9999999),
    httpOnly: false,
    // Forces to use https in production
    sameSite: 'none',
    // Forces to use https in production
    secure: true,
  });
    */
  res.status(201).json({
    user: addUserEntry,
  });

});


export default signupRouter;
