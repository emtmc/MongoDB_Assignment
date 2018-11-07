const express = require('express');
const app = express();
//logging package
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//initiliaze routes
const productRoutes = require('./api/routes/products');

//connect to database
mongoose.connect('mongodb://User1:Password1@cluster0-shard-00-00-nqiz8.mongodb.net:27017,cluster0-shard-00-01-nqiz8.mongodb.net:27017,cluster0-shard-00-02-nqiz8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

//uses other packages
app.use(express.static('ui'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//prevents cross-origin resource sharing (CORS) - security mechanism by browser via headers
app.use((res, req, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//forward requests to products.js
app.use('/products', productRoutes);

//if no route is found or available errors are shown
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;

