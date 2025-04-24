import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'dev'; // Set the node environment to development if it is not set
dotenv.config({ path: `.env.${nodeEnv}` }); // Load the environment variables from the .env file

export const env = { // Environment configuration object
  nodeEnv: nodeEnv,
  db: {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    force: process.env.DB_FORCE, // Force sync the database
    alter: process.env.DB_ALTER, // Alter the database schema
  },
  server: {
    port: process.env.SERVER_PORT,
    jwtSecret: process.env.JWT_SECRET, 
  },
  encryption: {
    pubkey: process.env.pubkey,
  },
  email: {
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  filePaths: {
    staticFilePath: process.env.STATIC_FILE_PATH,
    relativePath: process.env.RELATIVE_PATH,
  },
  frontEndUrl: process.env.FRONTEND_URL,
};
