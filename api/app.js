const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const chatRouter = require('./routes/chat');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const ImgRouter = require('./routes/image');
const ItemRouter = require('./routes/item');
const reviewRouter = require('./routes/review');
const paymentRouter = require('./routes/payment');
const checkoutRouter = require('./routes/checkout');
const assistantRouter = require('./routes/assistant');

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
];

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

app.set('trust proxy', 1);

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
    }),
);
app.use(cors(corsOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/customer', usersRouter);
app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/img', ImgRouter);
app.use('/item', ItemRouter);
app.use('/reviews', reviewRouter);
app.use('/chats', chatRouter);
app.use('/payments', paymentRouter);
app.use('/checkout', checkoutRouter);
app.use('/assistant', assistantRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;