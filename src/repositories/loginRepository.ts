// import { Connection, RowDataPacket } from "mysql2/promise";

// export class LoginRepository {
//     findUserByEmail(email: any) {
//         throw new Error('Method not implemented.');
//     }
//     static getUserByEmail(email: string) {
//         throw new Error('Method not implemented.');
//     }
//     private connection: Connection;

//     constructor(connection: Connection) {
//         this.connection = connection;
//     }

//     async getUserByEmail(email: string): Promise<RowDataPacket | null> {
//         const sql = 'select * from users where email = ?';
//         const [results] = await this.connection.promise().query(sql, [email]);
//         return results.length ? results[0] : null;
//     }
// }

// import { connection } from '../database';
// import { RowDataPacket } from 'mysql2';

// export class LoginRepository {
//     // 他のメソッドや処理をここに追加できます

//     async findUserByEmail(email: string): Promise<RowDataPacket[]> {
//         const sql = 'select * from users where email = ?';
//         const [results] = await connection.query(sql, [email]);
//         return results;
//     }

//     // 他のメソッドや処理をここに追加できます
// }