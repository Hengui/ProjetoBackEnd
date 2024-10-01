const Product = require('./models/product');
const Cart = require('./models/cart');
const Message = require('./models/message');

const dbManager = {
    addProduct: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },
    getProducts: async () => {
        return await Product.find();
    },
};

module.exports = dbManager;
