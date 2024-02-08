import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../models/user.model.js';
import jwtStrategy from "passport-jwt"
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { PRIVATE_KEY } from '../utils/jwt.js';
// import GitHubStrategy from "passport-github"



const localStrategy = passportLocal.Strategy

const JwtStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt

const initializePassport = () => {
    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        console.log("Entrando a passport Strategy con JWT.")
        try {
            console.log("JWT obtenido del Payload");
            console.log(jwt_payload);
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                //Validamos si el user existe en la DB
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("El user ya existe!!");
                    done(null, false)
                }
    
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // password //se encriptara despues...
                    password: createHash(password),
                    loggedBy: 'form'
                }
                const result = await userModel.create(user);
                console.log(result);
                // Todo sale ok
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    })
}



const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {//Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

// passport.use('github', new GitHubStrategy(
//     {
//         clientID: 'Iv1.4a03940105c5ebf7',
//         clientSecret: '7431fb0b31267059cd32c1bc00942cef34e7aa7c',
//         callbackUrl: 'http://localhost:5000/api/sessions/githubcallback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         console.log("Profile obtenido del usuario de GitHub ");
//         try {
//             const user = await userModel.findOne({ email: profile._json.email });
//             console.log("Usuario encontrado para login");
//             if (!user) {
//                 console.warn("User doesn't exists with username " + profile._json.email);
//                 let newUser = {
//                     first_name: profile._json.name,
//                     last_name: '',
//                     age: 28,
//                     email: profile._json.email,
//                     password: '',
//                     loggedBy: "GitHub"
//                 }
//                 const result = await userModel.create(newUser);
//                 return done(null, result)
//             } else {
//                 return done(null, user)
//             }

//         } catch (error) {
//             return done(error)
//         }
//     }
// ))

// passport.use('register', new localStrategy(

//     { passReqToCallback: true, usernameField: 'email' },
//     async (req, username, password, done) => {
//         const { first_name, last_name, email, age } = req.body;
//         try {
            
//             const exist = await userModel.findOne({ email });
//             if (exist) {
//                 console.log("El user ya existe!!");
//                 done(null, false)
//             }

//             const user = {
//                 first_name,
//                 last_name,
//                 email,
//                 age,
//                 password: createHash(password)
//             }

//             if (user.email === "adminCoder@coder.com" && user.password === "Cod3r123") {
//                 user.role = "admin";
//             } else {
//                 user.role = "user";
//             }

//             const result = await userModel.create(user);
//             return done(null, result)

//         } catch (error) {
//             return done("Error registrando al usuario: Dupliacado en la base de datos");
//         }

//     }

// ))



// passport.use('login', new localStrategy(
//     { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
//         try {
//             const user = await userModel.findOne({ email: username });
//             console.log("Usuario encontrado para login:");

//             if (!user) {
//                 console.warn("User doesn't exists with username: " + username);
//                 return done(null, false);
//             }
//             if (!isValidPassword(user, password)) {
//                 console.warn("Invalid credentials for user: " + username);
//                 return done(null, false);
//             }
//             return done(null, user);
//         } catch (error) {
//             return done(error);
//         }
//     })
// );






export default initializePassport;