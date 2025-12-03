const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

router.post('/login', login); // POST /admin/login

module.exports = router;
