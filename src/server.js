// Units
import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"
import Handlebars from "handlebars"
import MongoStore from "connect-mongo"
import session from "express-session"
import cookieParser from "cookie-parser"

//  Server
import __dirname from "./dirname.js"
import envConfig from "./config/env.config.js"
const port = envConfig.port
const mongo_url = envConfig.urlMongo


// Routes
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import usersViewsRouter from "./routes/users.views.routes.js"
import githubRouter from './routes/github-login.views.routes.js'
import jwtRouter from "./routes/jwt.routes.js"
import userRouter from "./routes/users.routes.js"

// Passport Imports
import passport from 'passport';
import initializePassport from './config/auth/passport.config.js'


// Express
console.log("PORT", port);
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
)

app.set("view engine", "hbs")

app.set("views", `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))


app.use(session(
    {
        store: MongoStore.create({
            mongoUrl: mongo_url,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 10 * 60
        }),
        secret: "coderS3cr3t",
        resave: false,
        saveUninitialized: true
    }
))

app.use(cookieParser("CoderS3cr3tC0d3"));


// Middleware de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter);
app.use('/users', usersViewsRouter)
app.use('/api/sessions', sessionsRouter)
app.use("/github", githubRouter)
app.use("/api/jwt", jwtRouter)
app.use('/api/users', userRouter);




// Levantar Servidor
app.listen(port, () => console.log(`Server running on port ${port}`))

// Mongoose
mongoose
    .connect(mongo_url)
    .then(() => {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log("Hubo un error");
        console.log(err)
    })