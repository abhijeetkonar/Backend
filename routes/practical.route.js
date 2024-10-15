const express = require("express");
const router = express.Router();
const practicalController = require("../controllers/practical.controllers");

router.get("/", practicalController.getPracticals);

module.exports = router;