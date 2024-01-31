import { Router } from 'express';
import userModel from '../models/user.model.js';
import passport from 'passport';
import { isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

const jwtRouter = Router();

jwtRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateToken(tokenUser);
        console.log(access_token);
        //1ro con LocalStorage
        // res.send({ message: "Login successful!", jwt: access_token });


        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                // httpOnly: true //No se expone la cookie
                // httpOnly: false //Si se expone la cookie

            }

        )
        res.send({ message: "Login success!!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// Register PassportLocal
jwtRouter.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
})


export default jwtRouter;