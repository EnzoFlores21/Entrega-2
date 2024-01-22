import { Router } from "express";
import userModel from "../models/user.model.js";

const sessionsRouter = Router()


// Register
sessionsRouter.post("/register", async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body
    console.log("Registrando usuario");
    console.log(req.body);


    const exist = await userModel.findOne({ email })
    if (exist) {
        return res.status(401).send({ status: "error", msg: "El usuario ya existe" })
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
    }

    if (user.email === "adminCoder@coder.com" && user.password === "Cod3r123") {
        user.role = "admin";
    } else {
        user.role = "user";
    }

    const result = await userModel.create(user)
    res.send({ status: "succes", message: "Usuario creado con exito con ID:" + result.id })
})




// Login
sessionsRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })

    if (!user) {
        return res.status(401).send({ status: "error", error: "Incorrect credentials" })
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
    }


    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) return res.status(200).send("deslogueo exitoso")
        else res.send("fallo el deslogueo")
    })
})



export default sessionsRouter