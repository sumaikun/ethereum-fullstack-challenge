const NFT = require('../models/nftModel');
const { Web3 } = require('web3');
const fetch = require('node-fetch');
require('dotenv').config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

const ERC721_ABI = [
    {
        inputs: [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        name: 'tokenURI',
        outputs: [{ "internalType": "string", "name": "", "type": "string" }],
        stateMutability: 'view',
        type: 'function',
    },
];

const ERC1155_ABI = [
    {
        constant: true,
        inputs: [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        name: 'uri',
        outputs: [{ "internalType": "string", "name": "", "type": "string" }],
        stateMutability: 'view',
        type: 'function',
    },
];

function resolveUri(uri) {
    if (uri.startsWith('ipfs://')) {
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return uri;
}

async function getNFTMetadata(req, res) {
    const { contractAddress, tokenId } = req.body;

    try {

        console.log("input",contractAddress, tokenId);

        const existingNFT = await NFT.findOne({ contractAddress, tokenId });
        if (existingNFT) {
            return res.status(200).json({ message: 'NFT metadata retrieved from database', nft: existingNFT });
        }

        let metadata;

        // Try fetching with ERC721_ABI
        try {
            const contract = new web3.eth.Contract(ERC721_ABI, contractAddress);
            const tokenUri = await contract.methods.tokenURI(tokenId).call();
            const resolvedUri = resolveUri(tokenUri);
            const metadataResponse = await fetch(resolvedUri);

            if (metadataResponse.status === 200) {
                metadata = await metadataResponse.json();
            } else {
                console.log(`Failed to fetch metadata. Status: ${metadataResponse.status}`);
            }
        } catch (err) {
            console.log('Failed with ERC721_ABI, trying ERC1155_ABI...', err);
        }

        // Try with ERC1155_ABI
        if (!metadata) {
            try {
                const contract = new web3.eth.Contract(ERC1155_ABI, contractAddress);
                const tokenUri = await contract.methods.uri(tokenId).call();
                const resolvedUri = resolveUri(tokenUri);
                const metadataResponse = await fetch(resolvedUri);

                if (metadataResponse.status === 200) {
                    metadata = await metadataResponse.json();
                } else {
                    console.log(`Failed to fetch metadata. Status: ${metadataResponse.status}`);
                }
            } catch (err) {
                console.log('Failed with ERC1155_ABI as well...', err);
            }
        }

        if (!metadata) {
            return res.status(400).json({ error: "Token not found" });
        }

        const imageUri = metadata.image && metadata.image.startsWith('ipfs://')
            ? resolveUri(metadata.image)
            : metadata.image;

        const nft = new NFT({
            contractAddress,
            tokenId,
            name: metadata.name,
            description: metadata.description,
            image: imageUri,
            attributes: metadata.attributes || [],
        });

        await nft.save();
        res.status(200).json({ message: 'NFT metadata saved successfully', nft });
    } catch (error) {
        console.error('Error fetching or saving NFT metadata:', error);
        res.status(500).json({ error: 'An error occurred while fetching NFT metadata' });
    }
}

async function getNFTsByContract(req, res) {

    try {
        const nfts = await NFT.find({}).sort({ createdAt: -1 });

        res.status(200).json({ nfts });
    } catch (error) {
        console.error('Error fetching NFTs by contract:', error);
        res.status(500).json({ error: 'An error occurred while retrieving NFTs' });
    }
}

module.exports = { getNFTMetadata, getNFTsByContract };