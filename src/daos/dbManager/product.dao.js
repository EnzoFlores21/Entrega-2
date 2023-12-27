import { productModel } from "../../models/product.model.js"

class productDao{
    constructor(){ this.model = productModel }

    async getAllProducts(limit = 10 , page = 1, query, sort ){
        let consulta = {}
        if (query != undefined){
            consulta[query.split(":")[0]] = query.split(":")[1]
        }
        return await this.model.paginate(consulta,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
            
    }

    async getProductById(id){
        return await this.model.findById(id)
    }

    async createProduct(product){
        return await this.model.create(product)
    }

    async updateProduct(id, product){
        return await this.model.findByIdAndUpdate(id, product)
    }

    async deleteProduct(id){
        return await this.model.findByIdAndDelete(id)
    }
}

export default productDao