const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Signup route
router.post('/auth/signup', userController.register);

// Login route
router.post('/auth/login', userController.login);

// room route
router.post('/rooms/', userController.getMemberRooms)

router.delete('/reset/:email', userController.resetUser)

router.get('/user/:id', userController.getUser)

router.post('/joinroom', userController.joinRoom)


module.exports = router;
