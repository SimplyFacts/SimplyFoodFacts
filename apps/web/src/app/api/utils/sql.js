import { neon } from '@neondatabase/serverless';

const connectionString = process.env.CUSTOM_DATABASE_URL || process.env.DATABASE_URL;

const NullishQueryFunction = () => {
  throw new Error('No database connection string was provided.');
};
NullishQueryFunction.transaction = () => {
  throw new Error('No database connection string was provided.');
};

const sql = connectionString ? neon(connectionString) : NullishQueryFunction;

export default sql;