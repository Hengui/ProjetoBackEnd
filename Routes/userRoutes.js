const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorization = require('../middleware/authorization');

router.get('/', authorization.isAdmin, userController.getAllUsers);

router.delete('/', authorization.isAdmin, userController.deleteInactiveUsers);

router.get('/management', authorization.isAdmin, userController.renderUserManagementView);

module.exports = router;
