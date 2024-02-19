import { Router } from "express";
import { githubAuth, githubCallback, register, login, loginFail, logout } from '../controllers/sessions.controller.js'

const router = Router()

router.get('/github', githubAuth)

router.get('/githubcallback', githubCallback)

router.post('/register', register)

router.get('/failregister', async (req,res)=>{
    console.log("Register failed")
    res.send({error:"Failed"})
})

router.post('/login', login)

router.get('/faillogin', loginFail)

router.get('/logout', logout)

export default router