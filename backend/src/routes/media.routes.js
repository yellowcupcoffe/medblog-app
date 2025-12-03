// src/routes/media.routes.js
const express = require("express");
const router = express.Router();
const { listFolder } = require("../controllers/media.controller");

router.get("/list", listFolder);

module.exports = router;
