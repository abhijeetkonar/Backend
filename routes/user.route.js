const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/signout', userController.signout);
router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);
router.put('/profile', authMiddleware.isAuthenticated, userController.updateProfile);
router.get('/papers/contributions', authMiddleware.isAuthenticated, userController.getUsersPapersContributions);
router.get('/practicals/contributions', authMiddleware.isAuthenticated, userController.getUsersPracticalsContributions);
router.delete('/contributions/:type/:contributionId', authMiddleware.isAuthenticated, userController.deleteContribution);

module.exports = router;
