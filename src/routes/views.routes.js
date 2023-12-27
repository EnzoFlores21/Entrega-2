import {Router} from 'express'
import CartDao from '../daos/dbManager/cart.dao.js'
import productDao from '../daos/dbManager/product.dao.js'

const daoProductos = new productDao()
const daoCarts = new CartDao()
const viewsRouter = Router()

viewsRouter.get('/',async (req,res)=>{
    const { limit,page,query,sort } = req.query
    const productos = await daoProductos.getAllProducts(limit, page, query, sort);

    res.render("products",{productos})
})

viewsRouter.get('/carts/:cid',async (req,res)=>{
    const {cid} = req.params
    const productos = await daoCarts.getProductsFromCart(cid)
    console.log(productos)
    res.render("cart",{productos})
})


export default viewsRouter;