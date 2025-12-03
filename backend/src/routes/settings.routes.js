// src/routes/settings.routes.js
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth.middleware");
const { getSettings, updateTheme } = require("../controllers/settings.controller");

router.get("/", getSettings);
router.put("/theme", requireAuth, updateTheme);

module.exports = router;
