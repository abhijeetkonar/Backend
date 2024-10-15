const express = require("express");
const router = express.Router();
const practicalController = require("../controllers/practical.controller");

router.get("/", practicalController.getPracticals);

module.exports = router;