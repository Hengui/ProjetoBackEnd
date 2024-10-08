const express = require('express');
const Product = require('../dao/models/product');
const router = express.Router();

module.exports = (io) => {
    router.get('/', async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
            };

            const filter = query ? { title: new RegExp(query, 'i') } : {};

            const result = await Product.paginate(filter, options);
            res.json({
                status: 'sucesso',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            res.status(500).json({ status: 'erro', error: error.message });
        }
    });

    return router;
};
