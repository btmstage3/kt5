// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware.isAuthenticated); 

router.get('/', employeeController.list);
router.get('/add', employeeController.form);
router.post('/create', employeeController.create);
router.post('/add', employeeController.create);
router.get('/edit/:id', employeeController.editForm);
router.post('/update/:id', employeeController.update);

module.exports = router;
