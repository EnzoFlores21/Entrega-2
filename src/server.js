import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"
import Handlebars from "handlebars"

import __dirname from "./dirname.js"
import { password, db_name, PORT } from "./env.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"



// Mongoose
mongoose.connect(
    `mongodb+srv://enzoflores21:${password}@clusterprueba.zwqxjbs.mongodb.net/${db_name}?retryWrites=true&w=majority`
)
    .then(() => {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log("Hubo un error");
        console.log(err)
    })


// Express
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


// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter);

// Levantar Servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))