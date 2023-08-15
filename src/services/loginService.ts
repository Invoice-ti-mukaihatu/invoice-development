// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { LoginRepository } from '../repositories/loginRepository';

// export class LoginService {
//     static async login(email: string, password: string): Promise<string> {
//         const user = await LoginRepository.getUserByEmail(email);
//         if (!user) {
//             throw new Error('User not found');
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             throw new Error('Invalid password');
//         }

//         const tokenPayload = { id: user.id };
//         const tokenOptions = { expiresIn: '30m' };
//         return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY as string, tokenOptions);
//     }
// }

// import { connection } from '../database';
// import bcrypt from 'bcrypt';

// export class LoginService {
//     // 他のメソッドや処理をここに追加できます

//     async createUser(email: string, password: string): Promise<number | Error> {
//         try {
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);
//             const user = { email, password: hashedPassword };
//             const sql = 'insert into users set ?';
//             const result = await connection.query(sql, user);
//             return result[0].insertId;
//         } catch (error) {
//             if (error.code === 'ER_DUP_ENTRY') {
//                 return new Error("このメールアドレスは既に登録されています。");
//             } else {
//                 return new Error("Internal Server Error");
//             }
//         }
//     }

//     // 他のメソッドや処理をここに追加できます
// }