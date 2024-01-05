import { cartModel } from "../../models/cart.model.js"

class CartDao {
    async getAllCarts() {
        try {
            return await cartModel.find();
        } catch (error) {
            throw new Error(`Error getting carts: ${error.message}`);
        }
    }


    async createCart(cart) {
        try {
            return await cartModel.create(cart);
        } catch (error) {
            throw new Error(`Error while creating cart: ${error.message}`);
        }
    }

    async getCartById(id) {
        return await cartModel.findById(id)
    }


    async getProductsFromCart(cid) {
        try {
            return await cartModel
                .findOne({ _id: cid })
                .populate({
                    path: "products.product",
                    model: "products",
                })
                .exec();
        } catch (error) {
            throw new Error(`Error getting products from cart: ${error.message}`);
        }
    }

    async updateProducts(cid, cart) {
        return await cartModel.findByIdAndUpdate(cid, cart)
    }
}

export default CartDao