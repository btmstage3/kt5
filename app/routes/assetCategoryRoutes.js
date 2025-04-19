const express = require('express');
const router = express.Router();
const assetCategoryController = require('../controllers/assetCategoryController');
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware.isAuthenticated); 

router.get('/', assetCategoryController.list);
router.get('/add', assetCategoryController.form);
router.post('/add', assetCategoryController.create);
router.get('/edit/:id', assetCategoryController.editForm);
router.post('/edit/:id', assetCategoryController.update);

module.exports = router;
