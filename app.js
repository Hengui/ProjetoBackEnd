const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./passportConfig');
const config = require('./config/config');
const UserDTO = require('./dto/userDTO');
const { ErrorHandler } = require('./errors/customErrors');
const logger = require('./logger');

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

const productRoutes = require('./Routes/productRoutes')(io); 
const cartRoutes = require('./Routes/cartRoutes')(io); 
const authRoutes = require('./Routes/authRoutes'); 

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('home', { products: productsData });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

app.get('/products', async (req, res, next) => {
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
            user: new UserDTO(req.user),
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
        next(error);
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
    logger.info('Conectado ao MongoDB');
    server.listen(port, () => {
        logger.info(`Servidor rodando na porta ${port}`);
    });
}).catch((err) => {
    logger.error('Erro ao conectar ao MongoDB', err);
});

const Message = require('./dao/models/message');

io.on('connection', (socket) => {
    logger.info('Novo cliente conectado');

    socket.on('addProduct', async (product) => {
        const newProduct = new Product({
            title: product.title,
            price: product.price
        });
        await newProduct.save();
        const products = await Product.find();
        io.emit('updateProducts', products);
        logger.info('Produto adicionado', newProduct);
    });

    socket.on('deleteProduct', async (productId) => {
        await Product.findByIdAndDelete(productId);
        const products = await Product.find();
        io.emit('updateProducts', products);
        logger.info(`Produto ${productId} deletado`);
    });

    socket.on('disconnect', () => {
        logger.info('Cliente desconectado');
    });
});

app.use((err, req, res, next) => {
    ErrorHandler.handleError(err, req, res, next);
});

app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warn('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logs gerados!');
});
