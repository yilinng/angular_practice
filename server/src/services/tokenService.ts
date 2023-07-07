import RefreshToken from '../models/refreshtoken';
import jwt from "jsonwebtoken";
//import { TokenEntry } from '../types/types';


const getEntries = () => {
  return null;
};

const addToken = async (entry: { email: string, password: string }) => {

  const newUserEntry = {
    ...entry,
  };

  //Create and assign a token
  // generate refresh token and put data in database
  const accessToken = generateAccessToken(newUserEntry);
  const refreshToken = jwt.sign(newUserEntry, process.env.REFRESH_TOKEN_SECRECT || '');
  const token = new RefreshToken({
    email: newUserEntry.email,
    refresh_token: refreshToken,
  });

  await token.save();

  return { accessToken, refreshToken };
};



function generateAccessToken(user: { email: string, password: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return jwt.sign(user, process.env.TOKEN_SECRECT || '', { expiresIn: '200m' });
}

export default {
  getEntries,
  addToken,
};