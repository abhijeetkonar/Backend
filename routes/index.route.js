const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controllers');

router.get('/', indexController.index);
router.get('/count', indexController.countDocuments);
router.get('/top-contributors', indexController.topContributors);

module.exports = router;
