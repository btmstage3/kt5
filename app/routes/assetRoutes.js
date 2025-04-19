// routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { Asset, Employee, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware.isAuthenticated); 

router.get('/', assetController.list);
router.get('/add', assetController.form);
router.post('/add', assetController.create);
router.get('/edit/:id', assetController.editForm);
router.post('/edit/:id', assetController.update);
router.get('/stock', assetController.stockView);
router.put('/:id', assetController.update);


 
 
  
module.exports = router;
