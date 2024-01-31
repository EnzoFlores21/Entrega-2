import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const sessionsRouter = Router()

sessionsRouter.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    { }
})

sessionsRouter.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/users")
})



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

    const user = req.user;
    
    if (!req.user) {
        return res.status(400).send({status: "error", error: "Invalid Credentials" })
    }


    // req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age
    // }
    
    // res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });

    const access_token = generateToken(user)
    console.log(access_token);
    res.send({ access_token: access_token });
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