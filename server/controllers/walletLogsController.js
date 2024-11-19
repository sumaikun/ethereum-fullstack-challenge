const WalletLog = require('../models/walletLogModel'); 
const axios = require('axios');
require('dotenv').config();

// Fetch the last 5 transactions from Etherscan
const getWalletLogs = async (req, res) => {
    const { contractAddress } = req.body;

    try {
        const existingLogs = await WalletLog.find({ contractAddress }).sort({ timestamp: -1 }).limit(5);

        if (existingLogs.length > 0) {
            console.log(`Retrieved logs from database for ${contractAddress}`);
            return res.status(200).json({ message: 'Wallet logs retrieved from database', logs: existingLogs });
        }

        const response = await axios.get('https://api.etherscan.io/api', {
            params: {
                module: 'account',
                action: 'txlist',
                address: contractAddress,
                startblock: 0,
                endblock: 99999999,
                sort: 'desc',
                apikey: process.env.ETHERSCAN_API_KEY,
            },
        });

        console.log('response',response);

        const transactions = response.data.result.slice(0, 5);

        if (transactions.length > 0) {
            console.log(`Last ${transactions.length} transactions for ${contractAddress}:`, transactions);

            const savedTransactions = await WalletLog.insertMany(transactions.map(tx => ({
                contractAddress,
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                timestamp: tx.timeStamp,
                blockNumber: tx.blockNumber,
            })));

            return res.status(200).json({ message: 'Wallet logs retrieved and stored', logs: savedTransactions });
        } else {
            console.log(`No transactions found for ${contractAddress}.`);
            return res.status(404).json({ message: 'No transactions found' });
        }
    } catch (error) {
        console.error('Error fetching wallet logs:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'An error occurred while fetching wallet logs' });
    }
};

const getStoredWalletLogs = async (req, res) => {
    try {
        const logs = await WalletLog.find({}).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (error) {
        console.error('Error fetching wallet logs:', error);
        res.status(500).json({ error: 'An error occurred while retrieving wallet logs' });
    }
};

module.exports = { getWalletLogs, getStoredWalletLogs };
