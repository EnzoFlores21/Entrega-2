import jwt from "jsonwebtoken"
import passport from "passport"

export const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret"

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY,{expiresIn: "24h"})
    return token
}


export const authToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization

    console.log(authHeader)

    if (!authHeader) {
        return res.status(401).send({error: "Not authenticate"})
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
        
        req.user = credentials.user;
        console.log(req.user);
        next();
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};


// para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
};