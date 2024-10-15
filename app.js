const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const User = require('./dao/models/user');
const Product = require('./dao/models/product'); 
const port = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'seuSegredo',
    resave: false,
    saveUninitialized: true
}));

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

// Rota para registro
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = email === 'adminCoder@coder.com' ? 'admin' : 'user';
    const user = new User({ email, password: hashedPassword, role: userRole });
    await user.save();
    res.redirect('/login');
});

// Rota para login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/products');
    } else {
        res.redirect('/login');
    }
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/products', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };
        const filter = query ? { title: new RegExp(query, 'i') } : {};
        const result = await Product.paginate(filter, options);
        res.render('products', {
            user: req.session.user,
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'erro', error: error.message });
    }
});

// Conectar ao MongoDB
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

// Modelo para Message
const Message = require('./dao/models/message');

// Servidor de chat
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
