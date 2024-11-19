const { create } = require('ipfs-http-client');
const dotenv = require('dotenv');
const IPFSData = require('../models/ipfsDataModel');

dotenv.config();

const ipfs = create({
  host: process.env.IPFS_HOST,
  port: process.env.IPFS_PORT,
  protocol: process.env.IPFS_PROTOCOL,
});

const addDataToIPFS = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const { path } = await ipfs.add(content);
    console.log('File added with CID:', path);

    const newData = await IPFSData.create({ cid: path, content });
    res.status(201).json({ cid: path, message: 'Data added to IPFS successfully', data: newData });
  } catch (error) {
    console.error('Error adding data to IPFS:', error);
    res.status(500).json({ error: 'Failed to add data to IPFS' });
  }
};

const getDataFromIPFS = async (req, res) => {
  const { cid } = req.query;

  console.log('cid',cid);

  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const fileContent = Buffer.concat(chunks).toString();
    res.status(200).json({ content: fileContent });
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    res.status(500).json({ error: 'Failed to retrieve data from IPFS' });
  }
};

const listAllIPFSData = async (req, res) => {
  try {
    const data = await IPFSData.find({});
    res.status(200).json({ message: 'All IPFS data retrieved successfully', data });
  } catch (error) {
    console.error('Error retrieving all IPFS data:', error);
    res.status(500).json({ error: 'Failed to retrieve IPFS data' });
  }
};

module.exports = {
  addDataToIPFS,
  getDataFromIPFS,
  listAllIPFSData,
};
