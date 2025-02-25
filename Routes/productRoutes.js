const ProductRepository = require('../repository/productRepository');
const User = require('../dao/models/user');
const nodemailer = require('nodemailer');
const { ErrorHandler } = require('../errors/customErrors');

exports.getProducts = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        const filter = query ? { title: new RegExp(query, 'i') } : {};

        const result = await ProductRepository.getProducts(filter, options);
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
        next(error);
    }
};

exports.createProduct = async (io, req, res, next) => {
    const { title, price } = req.body;
    try {
        const newProduct = await ProductRepository.addProduct({ title, price });
        const products = await ProductRepository.getProducts({}, {});
        io.emit('updateProducts', products);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (io, req, res, next) => {
    const productId = req.params.pid;
    try {
        const product = await ProductRepository.getProductById(productId);
        await ProductRepository.deleteProduct(productId);
        if (product && product.userId) {
            const owner = await User.findById(product.userId);
            if (owner && owner.role === 'premium') {
                await sendProductDeletionEmail(owner.email, product.title);
            }
        }
        const products = await ProductRepository.getProducts({}, {});
        io.emit('updateProducts', products);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

async function sendProductDeletionEmail(recipientEmail, productTitle) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'usuario@example.com',
            pass: 'senha'
        }
    });
    await transporter.sendMail({
        from: '"E-commerce" <no-reply@example.com>',
        to: recipientEmail,
        subject: 'Produto Excluído',
        text: `Seu produto "${productTitle}" foi excluído da plataforma.`
    });
}
