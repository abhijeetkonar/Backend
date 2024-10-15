const express = require("express");
const router = express.Router();
const papersController = require("../controllers/paper.controllers");

router.get("/", papersController.getPapers);

module.exports = router;