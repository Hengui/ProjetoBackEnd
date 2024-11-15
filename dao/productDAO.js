const Product = require('./models/product');

const productDAO = {
    addProduct: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },
    getProducts: async (filter, options) => {
        return await Product.paginate(filter, options);
    },
    deleteProduct: async (productId) => {
        return await Product.findByIdAndDelete(productId);
    }
};

module.exports = productDAO;
