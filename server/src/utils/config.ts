import "dotenv/config";

const PORT = process.env.PORT;

const DATABASE_URL =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;


export default {
  DATABASE_URL,
  PORT,
};
