const express = require('express');
const { getNFTMetadata, getNFTsByContract } = require('../controllers/nftController');
const router = express.Router();

router.post('/metadata', getNFTMetadata);
router.get('/', getNFTsByContract);

module.exports = router;
