// assetReturnRoutes.js
const express = require('express');
const router = express.Router();
const assetReturnController = require('../controllers/assetReturnController');
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware.isAuthenticated); 


router.get('/return', assetReturnController.renderReturnAssetForm);
router.get('/scrap', assetReturnController.renderScrapAssetForm);
router.post('/scrap-asset', assetReturnController.scrapAsset);


router.get('/history', assetReturnController.renderHistoryAssetForm);
router.get('/history-asset/:asset_id', assetReturnController.historyAsset);

router.post('/return-asset', assetReturnController.returnAsset);
router.get('/get-employees', assetReturnController.searchEmployees);
router.get('/get-assets', assetReturnController.searchAssets);

router.get('/get-assets-return', assetReturnController.searchAssetsReturn);
router.get('/get-assets-scrap', assetReturnController.searchAssetsScrap);

router.get('/get-issued-assets', assetReturnController.getIssuedAssets);
module.exports = router;
