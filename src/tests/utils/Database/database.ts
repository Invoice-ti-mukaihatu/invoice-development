import * as dotenv from "dotenv";
import { createConnection, Connection } from "mysql2/promise";

export async function createDBConnection(): Promise<Connection> {
  dotenv.config();
  const { MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

  const connection = await createConnection({
    host: "localhost",
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });
  return connection;
}
