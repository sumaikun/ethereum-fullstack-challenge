const express = require('express');
const { getWalletLogs, getStoredWalletLogs } = require('../controllers/walletLogsController');
const router = express.Router();

router.post('/', getWalletLogs);
router.get('/', getStoredWalletLogs);

module.exports = router;
