const cartDAO = require('../dao/cartDAO');

class CartRepository {
    async createCart() {
        return await cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await cartDAO.getCartById(cartId);
    }

    async addProductToCart(cartId, productId) {
        return await cartDAO.addProductToCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await cartDAO.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartDAO.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await cartDAO.clearCart(cartId);
    }
}

module.exports = new CartRepository();
