const express = require('express');
const router = express.Router();
const path = require('path');

// The symbols below mean: It must begin(^) with a / and end($) with a slash
// OR it is /index.html
router.get('^/$|/index(.html)?', (req, res) => {
    // An alternative way
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..','views', 'subdir', 'index.html'));
})

router.get('^/$|/test(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..','views', 'subdir', 'test.html'));
})

module.exports = router;