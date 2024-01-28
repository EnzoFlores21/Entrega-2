import { Router } from "express";

const githubRouter = Router()

githubRouter.get("/login", (req, res) => {
    res.render("github-login")
})

export default githubRouter