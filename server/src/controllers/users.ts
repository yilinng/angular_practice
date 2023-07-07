import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const usersRouter = express.Router();

import User from '../models/user';
import RefreshToken from '../models/refreshtoken';
//import checkToken from '../utils/verifyToken';
//import { v4 as uuidv } from "uuid";
import { UserEntry } from '../types/types';
import { tokenExtractor, userExtractor } from '../utils/middleware';

//use refreshtoken to yield new accesstoken
//https://dev.to/juliecherner/authentication-with-jwt-tokens-in-typescript-with-express-3gb1

interface UserRequest extends Request {
  user?: UserEntry
}

/*
router.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) res.sendStatus(401);
  const refreshTokens = await RefreshToken.findOne({
    refresh_token: refreshToken,
  });
  if (!refreshTokens) res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRECT || '',
    (err, olduser) => {
      const user = { email: olduser.email, pwd: olduser.pwd };
      if (err) res.sendStatus(403);
      const accessToken = generateAccessToken(user);
      res.cookie('token', accessToken, {
        expires: new Date(Date.now() + 9999999),
        httpOnly: true,
        // Forces to use https in production
      });
      res.status(200).json({ accessToken });
    }
  );
});
*/
usersRouter.get('/get-cookies', (req: UserRequest, res: Response) => {
  //const rawCookies = req.headers.cookie ? req.headers.cookie.split('; ') : null;

  //if(rawCookies === null) return res.sendStatus(403);

  //const [token, retoken] = rawCookies;

  //const [tokenName, tokenVal] = token.split('=');

  //const [reName, retokenVal] = retoken.split('=');

  res.status(200).json({ cookies: req.cookies });
});

//Getting this user
usersRouter.get('/', tokenExtractor,
  userExtractor, async (req: UserRequest, res: Response) => {

    //console.log('req headers', req.headers);

    const rawCookies = req.headers.cookie ? req.headers.cookie.split('; ') : null;

    if (rawCookies === null) return; //res.status(400).json('you have to login');

    if (!req.user) {
      return res.json({ message: "user not found" });
    }

    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
});

//Getting all user email
usersRouter.get('/email', async (_req, res) => {
  
  const users = await User.find();
  const emailList = users.map((user: { email: string; }) => user.email);

  res.json({email: emailList });
});
  
//Getting this user
usersRouter.get('/:id', tokenExtractor,
  userExtractor, async (req: UserRequest, res: Response) => {

    //console.log('get user id', req.params);

   // console.log('req.headers', req.headers);

    //const rawCookies = req.headers.cookie ? req.headers.cookie.split('; ') : null;

    //console.log('rawCookies', rawCookies);

    //if (rawCookies === null) return; //res.status(400).json('you have to login');

    if (!req.user) {
      return res.json({ message: "user not found" });
    }
    
    try {
      const user = await User.findById(req.params.id);

      console.log('get user detail.', user);
      res.status(200).json(user);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
  });


usersRouter.put('/update-profile', tokenExtractor,
  userExtractor, async (req: UserRequest, res: Response) => {
    const {
      headers: { cookie },
    } = req;
    //if no cookie
    if (cookie === undefined) res.status(404).json({ message: 'you are need authorization!!' });

    let hashedPassword;

    if (!req.user) {
      return res.json({ message: "user not found" });
    }

    //check hash password is same
    if (req.body.password === req.user.password) {
      hashedPassword = req.user.password;
    }
    //if have value
    if (!hashedPassword) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    try {
      const user = await User.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
          },
        }
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  });

//clear token need refreshtoken !!
usersRouter.delete('/logout', tokenExtractor,
  userExtractor, (req: UserRequest, res: Response) => {

    if (!req.user) {
      return res.json({ message: "user not found" });
    }

    console.log('logout', req.user);

    
    try {
      //refreshTokens database have to delete when log out!!
      RefreshToken.deleteOne({ email: req.user.email })
        .then((res: any) => console.log('success', res))
        .catch((err: any) => console.log('fail', err));

      //  Clearing the cookie
      res.clearCookie('token');
      res.clearCookie('retoken');
      //refreshTokens = refreshTokens.filter(token => token !== req.body.token);
      res.status(201).json({message: "logout success"});
    } catch {
      res.status(500).json({ message: 'server error...' });
    }
    
  });



export default usersRouter;
