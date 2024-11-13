const express = require("express");
const Router = express.Router();
const { loginController, fetchUsersController, registerController } = require("../controller/userController");
const { protect } = require('../middleware/authMiddleware');

Router.post('/register', registerController);
Router.post('/login', loginController);
Router.post('/fetchUsers', protect, fetchUsersController); 

module.exports = Router;