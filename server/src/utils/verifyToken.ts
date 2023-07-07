import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { UserEntry } from '../types/types';

//https://stackoverflow.com/questions/68403905/how-to-add-additional-properties-to-jwtpayload-type-from-types-jsonwebtoken
//https://blog.logrocket.com/extend-express-request-object-typescript/

export const SECRET_KEY: Secret = process.env.TOKEN_SECRECT || '';
/*
declare module 'jsonwebtoken' {
    export interface UserJwtPayload extends jwt.JwtPayload {
        email: string;
        password: string;
        name: string;
        signUpDate: string;
    }
}
*/
interface UserRequest extends Request {
    user?: UserEntry;
}

export default function checkToken(
    req: UserRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //console.log('token', token);

    if (!token) return res.status(401).send('Access denied');
    try {
        const varified = (
            jwt.verify(token, SECRET_KEY)
        );

        console.log('varified', varified);

        verifyDecodedToken(varified);

        req.user = varified;

        next();


    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}


function verifyDecodedToken(data: unknown): asserts data is UserEntry {
    if (!(data instanceof Object)) throw new Error('Deocde token error. Token must be an object');
}

