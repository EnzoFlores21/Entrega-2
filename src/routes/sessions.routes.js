import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import passport from "passport";

const sessionsRouter = Router()


// Register
sessionsRouter.post('/register', passport.authenticate('register', {
    failureRedirect: 'api/session/fail-register'
}), async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
})




// Login
sessionsRouter.post('/login', passport.authenticate('login',
    {
        failureRedirect: 'api/session/fail-login'
    }
), async (req, res) => {
    console.log("User found to login:");

    const user = req.user;
    console.log(user);

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) return res.status(200).send("deslogueo exitoso")
        else res.send("fallo el deslogueo")
    })
})

sessionsRouter.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

sessionsRouter.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});




export default sessionsRouter