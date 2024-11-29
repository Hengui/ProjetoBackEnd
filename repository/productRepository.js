const productDAO = require('../dao/productDAO');

class ProductRepository {
    async addProduct(productData) {
        return await productDAO.addProduct(productData);
    }

    async getProducts(filter, options) {
        return await productDAO.getProducts(filter, options);
    }

    async deleteProduct(productId) {
        return await productDAO.deleteProduct(productId);
    }
}

module.exports = new ProductRepository();
