// Cross Origin Resource Sharing(CORS)
// allows for server and data to be used accross the internet
const allowedOrigins = require('./allowedOrigins')

// corsOption will look for if origin site is on allowedOrigins, return a error callback if not
const corsOptions = {
    // origin is who is requesting ex: google.com
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // return null and true if on allowedOrigins
            callback(null, true)
        } else {
            // return a new Error if not on allowedOrigins
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;