const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

//socket.io.js
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

app.get('/chat', (req, res) => {
    res.render('chat');
});

//Conectar ao MongoDB
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
    server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
});

//Message
const Message = require('./dao/models/message');

//chat
io.on('connection', (socket) => {
    console.log('Um usuário conectou');
    
    socket.on('sendMessage', async (data) => {
        const newMessage = new Message(data);
        await newMessage.save();
        io.emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Um usuário desconectou');
    });
});
