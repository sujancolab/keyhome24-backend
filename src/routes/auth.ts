import Router, { error, t } from "elysia";
import bcrypt from "bcryptjs";
import mailsend from '@Services/mail';
import cryptUtils from "@Services/crypto";
import UsersController from "@Controllers/AuthController";

const usersRouter = new Router();

usersRouter.post(
    "/auth/register",
    async ({
        body,
    }: {
        body: { email: string; password: string; name: string; phone: string };
    }) => {
        const { email, password, name, phone } = body;

        const user = await UsersController.getUserByEmail(email);
        if (user) {
            return error(409, {
                errors: [{ message: "User already exists." }],
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UsersController.createUser(email, hashedPassword, name, phone);

        return {
            message: "User created",
        };
    },
    {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            name: t.String(),
            phone: t.String(),
        }),
    }
);

usersRouter.post(
    "/auth/login",
    async ({
        jwt,
        body,
    }: {
        jwt: any;
        body: { email: string; password: string };
    }) => {
        const { email, password } = body;

        const user = await UsersController.getUserByEmail(email);

        if (!user) {
            return error(404, { errors: [{ message: "User not found" }] });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return error(401, { errors: [{ message: "Invalid password" }] });
        }

        const token = await jwt.sign({ id: user.id });

        return {
            token,
            user,
        };
    },
    {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
    }

);

usersRouter.post('/auth/forgot-password',
    async({body}:{
        body:{
            email:string;
        }
    })=>{
        const {email}=body;
        const user = await UsersController.getUserByEmail(email);
        console.log('email',email);
        console.log(user);
        if(user){
            const encryptedid=cryptUtils.encrypt(user.id.toString());
            console.log("encruyu",encryptedid);
            console.log("encruyu",cryptUtils.decrypt(encryptedid));
            
            mailsend(email,"Reset Password Link","http://localhost:5173/auth/reset-password/"+encryptedid);
        }

        
    }
)
usersRouter.post('/auth/reset-password',
    async({body}:{
        body:{
            id:string;
            password:string;
        }
    })=>{
        const {id,password}=body;
        let decrypedId=cryptUtils.decrypt(id);
        const user = await UsersController.getUserById(parseInt(decrypedId));
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if(user){
          return await UsersController.updateUserPassword(user.id, hashedPassword);
        }

        
    }
)


export default usersRouter;
