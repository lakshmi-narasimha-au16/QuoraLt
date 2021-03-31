const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');
const indexRouter = require('./controller/index');
const expressLayouts = require('express-ejs-layouts');
const authRouter = require('./controller/authRouter');
const quesRouter = require('./controller/QuesRouter');
const AnsRouter = require('./controller/AnsRouter');
const VotesRouter = require('./controller/VotesRouter');
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const upload = multer();


// settings and middlewares
app.use(express.json({limit: '50mb'}))
app.use(cookieParser());
app.use(express.urlencoded({limit: '50mb', extended:true}))
app.set('view engine', 'ejs')
app.set('layouts', 'views/layout');
app.use(expressLayouts);
app.use(cors({
    origin:"http://localhost:3000",
    optionsSuccessStatus: 200,
    "Access-Control-Allow-Headers": ['Content-Type'],
    credentials:true
}))
app.use(upload.none())


// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/question', quesRouter);
app.use('/answer', AnsRouter)
app.use('/vote', VotesRouter);



// Port Number
const port = process.env.PORT || 5000;


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