const express = require('express');
const router = express.Router();
const path = require('path');

// The symbols below mean: It must begin(^) with a / and end($) with a slash
// OR it is /index.html
router.get('^/$|/index.html', (req, res) => {
    // An alternative way
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..','views', 'index.html'));
})
// (.html)? makes .html optional to put in the url
router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
})

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); // 301 is the redirect status code, it is 302 by default. 301 means it is perminent
})

module.exports = router;