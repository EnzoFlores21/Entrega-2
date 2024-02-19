import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../../models/user.model.js';
import jwtStrategy from "passport-jwt"
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import { PRIVATE_KEY } from '../../utils/jwt.js';
import GitHubStrategy from "passport-github"



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
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }
    ))


    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
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
                    password: createHash(password),
                    loggedBy: 'form'
                }
                const result = await userModel.create(user);
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done) =>{
        try{
            console.log(profile)
            let user = await userModel.findOne({email:profile._json.email})
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 31,
                    email: profile._json.email,
                    password:""
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }
            else{
                return done(null, user)
            }

        }
        catch(error){
            return done(error)

        }
    }
    ))

    


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
    if (req && req.cookies) {
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};


export default initializePassport;