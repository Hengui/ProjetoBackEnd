const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

const productsRouter = require('./Routes/products');
const cartsRouter = require('./Routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
