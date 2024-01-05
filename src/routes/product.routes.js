import { Router } from "express"
import productDao from "../daos/dbManager/product.dao.js"

const daoProductos = new productDao()

const productRouter = Router()

productRouter.get('/',async (req,res)=>{
    try{
        const { limit,page,query,sort } = req.query
        const productos = await daoProductos.getAllProducts(limit, page, query, sort);
        res.json(productos)
    }
    catch(err){
        res.status(500).json({error:err})
    }
})

productRouter.get('/:pid', async (req,res)=>{
    try{
        
        const{ pid } = req.params
        const producto = await daoProductos.getProductById(pid)
        res.json(producto)

    }
    catch(err){
        res.status(500).json({error:err})
    }

    

})

productRouter.post('/', async (req,res)=>{
    try{
        let producto = req.body
        const newProduct = await daoProductos.createProduct(producto)
        res.status(201).json({message: "Producto agregado correctamente"})
    }
    catch(err){
        res.status(500).json({error:err})
    }

})

productRouter.put('/:pid',async (req,res)=>{
    
    try{
        const { pid } = req.params
        const product = req.body


        
        const result = await daoProductos.updateProduct(pid, product)

        const fetchedUpdatedProduct = await daoProductos.getProductById(pid);


        res.status(201).json({
            resultado: fetchedUpdatedProduct,
            message: "Producto Actualizado"
        })
    }
    catch(err){
        res.status(500).json({error:err})
    }    
})

productRouter.delete('/:pid', async (req,res)=>{
    try{
        let deleted =await daoProductos.deleteProduct(req.params.pid)
        res.status(201).json(deleted.message)
    }
    catch(err){ res.status(500).json({error:err})}
    
})


export default productRouter
