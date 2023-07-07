import bcrypt from "bcrypt";
import express, { Request, Response } from 'express';
const loginRouter = express.Router();

import User from "../models/user";
import RefreshToken from '../models/refreshtoken';

import { UserEntry } from '../types/types';
import { loginValidation } from '../validation';
import tokenService from '../services/tokenService';

interface UserRequest extends Request {
  user?: UserEntry
}

loginRouter.post("/", async (req: UserRequest, res: Response) => {

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });


  const user = await User.findOne({ email: req.body.email });

  if(!user) return res.status(400).json({message: "email do not exist"});

  //check password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ message: 'Invalid password' });

  //check user is login, check refreshtoken id
  const findUser = await RefreshToken.findOne({ email: req.body.email });
  if (findUser) return res.status(400).json({ message: 'user is login!' });

  const addTokenEntry = await tokenService.addToken({
    email: req.body.email,
    password: user.password,
  });

  res.cookie('token', addTokenEntry.accessToken, {
    expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    httpOnly: false,
    // Forces to use https in production
    secure: true,
    sameSite: 'none',
  });

  res.cookie('retoken', addTokenEntry.refreshToken, {
    expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours, // 24 hours
    httpOnly: false,
    // Forces to use https in production
    secure: true,
    sameSite: 'none',
  });


  res.status(201).json({
    addTokenEntry,
    user,
  });


});


export default loginRouter;
