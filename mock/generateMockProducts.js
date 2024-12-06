const faker = require('faker');
const Product = require('../dao/models/product');

const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(new Product({
            title: faker.commerce.productName(),
            price: faker.commerce.price()
        }));
    }
    return products;
};

module.exports = generateMockProducts;
