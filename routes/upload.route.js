const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const uploadController = require("../controllers/upload.controller");

router.post("/paper", authMiddleware.isAuthenticated, uploadController.uploadPaper);
router.post("/practical", authMiddleware.isAuthenticated, uploadController.uploadPractical);

module.exports = router;
