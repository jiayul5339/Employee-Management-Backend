require('dotenv').config();
const exp = require('constants');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// app.use() is for middleware
// app.get() GET requests
//app.all() Routing that accepts all http requests (GET, POST, PUt, etc.)
// app.listen() listens for and performs function


// Custom middleware logger
// We need to use next() because it is custom middleware and needs to move on
app.use(logger);
app.use(cors(corsOptions));
app.use(credentials);


// Built-in middleware to handle url encoded data
// in other words, form data (data that is passed in through the url that we can pull out):
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());



// serve static files (images, css, text files)
// Express will find the static files in the /public folder
app.use('/', express.static(path.join(__dirname, '/public')))
// Tells express to use the public directory for css when in the /subdir
app.use('/subdir', express.static(path.join(__dirname, '/public')))





///// Routes ////
app.use('/', require('./routes/root'));
// Tells app that when accessing subdir from URL to use the routes of subdir
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // Any routes below this will be protected and need verified
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));


// The symbols below mean: It must begin(^) with a / and end($) with a slash
// OR it is /index.html
// app.get('^/$|/index.html', (req, res) => {
//     // An alternative way
//     // res.sendFile('./views/index.html', { root: __dirname });
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// })
// // (.html)? makes .html optional to put in the url
// app.get('/new-page(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// })

// app.get('/old-page(.html)?', (req, res) => {
//     res.redirect(301, '/new-page.html'); // 301 is the redirect status code, it is 302 by default. 301 means it is perminent
// })

// app.get('/data.json', (req, res) => {
//     res.sendFile(path.join(__dirname, 'data', 'data.json'));
// })

// // Route handlers
// app.get('/hello(.html)?', (req, res, next)=>{
//     console.log('attempted to laod hello.html');
//     // next() moves the function to the next expression
//     next();
// }, (req, res) => {  // This is the next() expression that is ran
//     res.send('Hello World!');
// })

// Chain route handlers
// Will run through these functions through chaining with next(), 
// what middleware is (Anyting that is between the request and response)
// const one = (req, res, next) => {
//     console.log('one');
//     next();
// }

// const two = (req, res, next) => {
//     console.log('two');
//     next();
// }

// const three = (req, res) => {
//     console.log('three');
//     res.send('Finished!')
// }

// app.get('/chain(.html)?', [one, two, three]);


// app.all accepts all http requests (GET, POST, PUT, etc.)
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ ERROR: "404 Not Found"});
    } 
    else {
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

// Only start listening for request if database is successfully connected
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});