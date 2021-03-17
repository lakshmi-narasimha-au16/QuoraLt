const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');
const indexRouter = require('./controller/index');
const expressLayouts = require('express-ejs-layouts');
const authRouter = require('./controller/authRouter');



// settings and middlewares
app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs')
app.set('layouts', 'views/layout');
app.use(expressLayouts)


// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);



// Port Number
const port = process.env.port || 5000;


// Connection to Database
mongoose.connect(
    process.env.DATABASE_URL, 
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true
    },
    ((err)=>{
            if (err) throw err;
            console.log('Connected to db successFully...')
        }
    ))


// listening to server
app.listen(port, ()=>{
    console.log(`server started at port ${port}`)
})