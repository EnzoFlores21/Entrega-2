import { Router } from 'express'
import CartDao from '../daos/dbManager/cart.dao.js'
import productDao from '../daos/dbManager/product.dao.js'


const cartRouter = Router()
const DaoCart = new CartDao()
const daoProductos = new productDao()


cartRouter.get('/', async (req, res) => {
    try {
        const carts = await DaoCart.getAllCarts()
        res.json({
            carts,
            message: "Carritos Obtenidos"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

})

cartRouter.get("/:cid", async (req, res) => {
    try {
        const {cid} = req.params
        let cart = await DaoCart.getProductsFromCart(cid)
        let products = cart.products
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})


cartRouter.post('/', async (req, res) => {
    try {
        res.send(await DaoCart.createCart())
    } catch (err) {
        res.status(500).json({ error: err })
    }

})

cartRouter.post('/:cid/product/:pid', async (req, res) => {

    try {
        const { cid, pid } = req.params
        const product = await daoProductos.getProductById(pid)
        const cart = await DaoCart.getCartById(cid)
        if (product == null || cart == null) {
            return res.status(404).json("Producto Inexistente")
        } else {

            if (cart.products.some((e) => e.product._id.toString() == product._id)) {
                let index = cart.products.findIndex((e) => e.product._id.toString() == product._id)
                cart.products[index].quantity += 1
            }
            else {
                cart.products.push({ product: product._id })

            }
            const addedProduct = DaoCart.updateProducts(cart._id, cart)
            res.status(200).json(addedProduct)
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })

    }
})

cartRouter.put('/:cid', async (req, res) => {
    let cart = await DaoCart.getCartById(req.params.cid)
    let products = req.body
    products.forEach((e) => {
        if (cart.products.findIndex((p) => p.product._id.toString() == e._id) != -1) {
            cart.products[cart.products.findIndex((p) => p.product._id.toString() == e._id)].quantity += e.quantity
        } else {
            cart.products.push({ product: e._id, quantity: e.quantity })
        }

    })
    const addedProduct = DaoCart.updateProducts(cart._id, cart)
    res.status(200).json(addedProduct)

})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    let cart = await DaoCart.getCartById(req.params.cid)
    const product = await daoProductos.getProductById(req.params.pid)
    if (cart.products.some((e) => e.product._id.toString() == product._id)) {
        let index = cart.products.findIndex((e) => e.product._id.toString() == product._id)
        cart.products[index].quantity = req.body.quantity
        const addedProduct = DaoCart.updateProducts(cart._id, cart)
        res.status(200).json(addedProduct)
    }

})

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        let cart = await DaoCart.getCartById(req.params.cid)
        let newProducts = cart.products.filter((e) => e.product._id.toString() != req.params.pid)
        console.log(newProducts)
        cart.products = newProducts
        let updatedCart = DaoCart.updateProducts(req.params.cid, cart)
        res.status(201).json(updatedCart)
    }
    catch (err) { res.status(500).json({ error: err }) }

})

cartRouter.delete('/:cid', async (req, res) => {
    try {
        let deleted = await DaoCart.getCartById(req.params.cid)
        deleted.products = []
        let updatedCart = daoProductos.updateProduct(req.params.cid, deleted)
        res.status(201).json(deleted.message)
    }
    catch (err) { res.status(500).json({ error: err }) }

})


export default cartRouter