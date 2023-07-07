import 'dotenv/config';
import config from './utils/config';

import logger from './utils/logger';

import express from 'express';

const app = express();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';

import todosRouter from './controllers/todos';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import signupRouter from './controllers/signup';


logger.info('connecting to', config.DATABASE_URL || '');
/*
import redis from 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    host:'redis-server', port: 6379
});

client.on('connect', () => console.log(`Redis is connected on port ${REDIS_PORT}`));
client.on("error", (error) => console.error(error));
*/

/*
app.use(cors({
    credentials: true,
    origin: 'http://192.168.99.100:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
*/


app.use(cookieParser());
// HTTP request logger middleware for node.js
app.use(morgan('dev'));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

mongoose.set('strictQuery', false);

logger.info('connecting to', config.DATABASE_URL || '');

mongoose
  .connect(config.DATABASE_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error', error);
    logger.error('error connecting to MongoDB:');
  });

//routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

export default app;
