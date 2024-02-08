import { Router } from "express";
import userModel from '../models/user.model.js';
import {authToken} from '../utils/jwt.js';


const userRouter = Router();

userRouter.get("/:userId", authToken,
async (req, res) =>{
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId});
        }
        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
    }
});


export default userRouter;