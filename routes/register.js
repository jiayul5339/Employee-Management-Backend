const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerContoller');


router.post('/', registerController.handleNewUser);

module.exports = router;