const express = require('express');
const { addDataToIPFS, getDataFromIPFS, listAllIPFSData } = require('../controllers/ipfsController');
const router = express.Router();

router.post('/save', addDataToIPFS);
router.get('/retrieve', getDataFromIPFS);
router.get('/', listAllIPFSData);

module.exports = router;
