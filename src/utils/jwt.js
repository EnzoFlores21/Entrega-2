import jwt from "jsonwebtoken"

const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret"

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY,{expiresIn: "24h"})
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorizacion

    if (!authToken) {
        return res.status(401).send({error: "Not authenticate"})
    }

    
    const token = authHeader.split(' ')[1]

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
        //Token OK
        req.user = credentials.user;
        console.log(req.user);
        next();
    })
}
