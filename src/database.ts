import mysql2, { Connection } from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

export const connection: Connection = mysql2.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected mysql');
});