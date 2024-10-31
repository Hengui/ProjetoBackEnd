const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./passportConfig');
const User = require('./dao/models/user'); 

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
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority' })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

const productsRouter = require('./Routes/products')(io); 
const cartsRouter = require('./Routes/carts')(io); 
const authRouter = require('./Routes/auth'); 

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', authRouter);

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

const Message = require('./dao[_{{{CITATION{{{_1{](https://github.com/namtiennguyen97/greeting/tree/777240383e172afd0b11396af16064abc2c44324/resources%2Fviews%2Flogin.php)[_{{{CITATION{{{_2{](https://github.com/ttlgeek/Jointify-backend/tree/94ed80f45b6f3834ed63c81f337c80a9ae68fca2/passport.js)[_{{{CITATION{{{_3{](https://github.com/danandrei/node-test/tree/a781b1681f50aff9fec5e351bec9d381a27eccb4/lib%2Fpassport_strategies.js)[_{{{CITATION{{{_4{](https://github.com/SabrinaGar/proyecto/tree/15b6f1cadce5b863c883937e3c13d2bbb388e46f/config%2Fpassport.js)[_{{{CITATION{{{_5{](https://github.com/econtreras251/auth-email/tree/2406a8df879c1aa19027106b9f6618e31c05cd8d/config%2Fpassport.js)[_{{{CITATION{{{_6{](https://github.com/obeka/TODO-MERN/tree/8ee8aaebad02e869a910a761c0ba785cdd5cf73b/backend%2Fconfig%2Fpassport.js)[_{{{CITATION{{{_7{](https://github.com/ArjumanSreashtho/Survey-Manager/tree/88ca914e5afd3433aeffd1b0dc95c46f50a310b7/backend%2Fservice%2Fpassport.js)[_{{{CITATION{{{_8{](https://github.com/EC7495/OAUTH/tree/bbcf2075454bb217a896ec1f221926aaf4140897/server%2Fapp.js)[_{{{CITATION{{{_9{](https://github.com/AMU-Code-Squad/food-up/tree/706ef6d0aa5ce215a8a69d3757971562427f630b/routes%2Findex.js)[_{{{CITATION{{{_10{](https://github.com/earnubs/try-k8s/tree/4474f971ee6c209ef6db76f3e5b477ec4149033b/server%2Fauth.js)[_{{{CITATION{{{_11{](https://github.com/Area51TrainingCenter/NodeJS_GroupSI_01/tree/529af1890b967ff31f31254506794cce571426fb/Clase%2004%2FPreliminar%2F02-autenticacion-redes-sociales%2Froutes%2Findex.js)