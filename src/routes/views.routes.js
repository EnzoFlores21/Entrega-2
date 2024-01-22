import { Router } from 'express'
import CartDao from '../daos/dbManager/cart.dao.js'
import productDao from '../daos/dbManager/product.dao.js'
import userDao from '../daos/user.dao.js'

const daoProductos = new productDao()
const daoCarts = new CartDao()
const viewsRouter = Router()


viewsRouter.get("/", (req, res) => {
    res.render("login")
})

viewsRouter.get("/register", (req, res) => {
    res.render('register')
})

viewsRouter.get("/profile", (req, res) => {
    res.render('profile', {
        user: req.session.user,
    })
})



viewsRouter.get('/products', async (req, res) => {
    const { limit, page, query, sort } = req.query
    const userEmail = req.session.user.email

    const productos = await daoProductos.getAllProducts(limit, page, query, sort);
    const userToRender = await userDao.getUserByEmail(userEmail)

    res.render("products", {
        productos,
        userToRender,
    })
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    const productos = await daoCarts.getProductsFromCart(cid)
    console.log(productos)
    res.render("cart", { productos })
})



viewsRouter.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido!!')
    }
});


viewsRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: 'Error logout', msg: "Error al cerrar la session" })
        }
        res.send('Session cerrada correctamente!')
    })
});


viewsRouter.get('/login', (req, res) => {

    const { username, password } = req.query

    if (username != 'pepe' || password !== 'adminCod3er123') {
        return res.status(401).send("Login failed, check your credentianls")
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login Successful!!')
    }
});


function auth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
}

viewsRouter.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque estas autorizado a este recurso!')
});


export default viewsRouter;