// import { Request, Response, Router } from "express";
// import { LoginService } from '../services/loginService';

// export class LoginController {
//     private loginService: LoginService;
//     public router: Router;

//     constructor(loginService: LoginService) {
//         this.loginService = loginService;
//         this.router = Router();

//         this.router.post('/login', this.login);
//     }

//     private login = async (req: Request, res: Response) => {
//         try {
//             const { email, password } = req.body;
//             const token = await this.loginService.login(email, password);
//             res.status(200).json({ token });
//         } catch (error) {
//             res.status(401).json({ error: 'Authentication failed' });
//         }
//     };
// }


// import { Request, Response, Router } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { LoginService } from '../services/loginService';
// import { LoginRepository } from '../repositories/loginRepository';

// const router = Router();
// const loginService = new LoginService();
// const loginRepository = new LoginRepository();

// router.post("/login", async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: "メールアドレスとパスワードが必要です。" });
//         }

//         const results = await loginRepository.findUserByEmail(email);

//         if (results.length === 0) {
//             return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
//         }

//         const user = results[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: "メールアドレスまたはパスワードが違います。" });
//         }

//         const tokenPayload = { id: user.id };
//         const tokenOptions = { expiresIn: "30m" };
//         const token = jwt.sign(tokenPayload, JWT_SECRET_KEY as string, tokenOptions);

//         res.cookie("token", token, {
//             maxAge: 30 * 60 * 1000,
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict"
//         });

//         return res.status(200).json({ token });
//     } catch (error) {
//         console.error("ログインエラー:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// export default router;
