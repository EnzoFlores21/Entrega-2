import { Router } from "express";
import { authToken } from "../utils/jwt.js";

const  usersViewsRouter = Router()

usersViewsRouter.get("/login", (req, res) => {
    res.render("login")
})

usersViewsRouter.get("/register", (req, res) => {
    res.render('register')
})

usersViewsRouter.get("/", authToken, (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

export default usersViewsRouter