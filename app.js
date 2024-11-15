const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./passportConfig');
const config = require('./config/config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.mongoUri })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

const productRoutes = require('./routes/productRoutes')(io); 
const cartRoutes = require('./routes/cartRoutes')(io); 
const authRoutes = require('./routes/authRoutes'); 

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('home', { products: productsData });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

app.get('/products', async (req, res) => {
    if (!req.isAuthenticated()) {
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
            user: req.user,
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

app.get('/chat', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('chat');
});

mongoose.connect(config.mongoUri, {
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

const Message = require('./dao/models/message');

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('addProduct', (product) => {
        const newProduct = {
            id: productsData.length + 1,
            title: product.title,
            price: product.price,
        };
        productsData.push(newProduct);
        io.emit('updateProducts', productsData);
    });

    socket.on('deleteProduct', (productId) => {
        const index = productsData.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            productsData.splice(index, 1);
            io.emit('updateProducts', productsData);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
