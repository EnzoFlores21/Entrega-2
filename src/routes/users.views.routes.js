import { Router } from "express";
import { authToken } from "../utils/jwt.js";
import { passportCall, authorization } from "../utils/jwt.js";

const  usersViewsRouter = Router()

usersViewsRouter.get("/login", (req, res) => {
    res.render("login")
})

usersViewsRouter.get("/register", (req, res) => {
    res.render('register')
})

// Endpoint que renderiza la vista del perfil de usuario
usersViewsRouter.get("/",
    // authToken, //-> Usando Authorization Bearer Token
    // passport.authenticate('jwt', { session: false }), //-> Usando JWT por Cookie
    passportCall('jwt'), //-> Usando passport-JWT por Cookie mediante customCall
    authorization('user'),
    (req, res) => {
        res.render("profile", {
            user: req.user
        });
    }
);

export default usersViewsRouter