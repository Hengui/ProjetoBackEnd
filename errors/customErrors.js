class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const ErrorHandler = {
    handleError: (err, req, res, next) => {
        const { statusCode, message } = err;
        res.status(statusCode || 500).json({
            status: 'error',
            statusCode,
            message
        });
    },

    productNotFound: () => {
        return new CustomError(404, 'Produto não encontrado');
    },

    cartNotFound: () => {
        return new CustomError(404, 'Carrinho não encontrado');
    },

    insufficientStock: () => {
        return new CustomError(400, 'Estoque insuficiente para o produto');
    },

    validationError: (message) => {
        return new CustomError(400, message);
    }
};

module.exports = { ErrorHandler, CustomError };
