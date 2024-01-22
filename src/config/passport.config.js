import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

const localStrategy = passportLocal.Strategy;

const initializePassport = () => {

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
                    password: createHash(password)
                }

                if (user.email === "adminCoder@coder.com" && user.password === "Cod3r123") {
                    user.role = "admin";
                } else {
                    user.role = "user";
                }

                const result = await userModel.create(user);
                return done(null, result)

            } catch (error) {
                return done("Error registrando al usuario " + error);
            }

        }

    ))



    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("Usuario encontrado para login:");
                console.log(user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );




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


export default initializePassport;