const express = require('express');
const router = express.Router();
const assetIssueController = require('../controllers/assetsIssueController'); // path adjusted
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware.isAuthenticated); 

router.get('/issue', assetIssueController.renderIssueAssetForm);
router.post('/issue-asset', assetIssueController.issueAsset);
router.get('/get-employees', assetIssueController.searchEmployees);
router.get('/get-assets', assetIssueController.searchAssets);

module.exports = router;
