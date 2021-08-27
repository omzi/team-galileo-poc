const router = require('express').Router();
const { app } = require('../controllers/app.controller');

router.get('/', app);

module.exports = router;