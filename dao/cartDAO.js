const Cart = require('./models/cart');

const cartDAO = {
    createCart: async () => {
        const cart = new Cart({ products: [] });
        return await cart.save();
    },
    getCartById: async (cartId) => {
        return await Cart.findById(cartId).populate('products');
    },
    addProductToCart: async (cartId, productId) => {
        const cart = await Cart.findById(cartId);
        cart.products.push(productId);
        return await cart.save();
    },
    updateCart: async (cartId, products) => {
        const cart = await Cart.findById(cartId);
        cart.products = products;
        return await cart.save();
    },
    updateProductQuantity: async (cartId, productId, quantity) => {
        const cart = await Cart.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.equals(productId));
        cart.products[productIndex].quantity = quantity;
        return await cart.save();
    },
    clearCart: async (cartId) => {
        const cart = await Cart.findById(cartId);
        cart.products = [];
        return await cart.save();
    }
};

module.exports = cartDAO;
