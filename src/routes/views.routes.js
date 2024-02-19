import { Router } from 'express'
import ProductDao from '../services/product/product.dao.js'
import CartDao from '../services/cart/cart.dao.js'
const viewsRouter = Router()


viewsRouter.get('/',async (req,res)=>{
    const { limit,page,query,sort } = req.query
    const productos = await ProductDao.getAllProducts(limit, page, query, sort);
    
    res.render("products",{productos, user:req.session.user})
})

viewsRouter.get('/carts/:cid',async (req,res)=>{
    const {cid} = req.params
    const productos = await CartDao.getProductsFromCart(cid)
    console.log(productos)
    res.render("cart",{productos})
})


export default viewsRouter;