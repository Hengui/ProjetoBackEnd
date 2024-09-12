const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

// Servir o arquivo socket.io.js
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

const productsRouter = require('./Routes/products')(io); 
const cartsRouter = require('./Routes/carts')(io); 

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.render('home', { products: productsData });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
