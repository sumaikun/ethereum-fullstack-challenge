const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttributeSchema = new Schema({
    key: {
        type: String,
    },
    trait_type: {
        type: String,
    },
    value: {
        type: Schema.Types.Mixed,
    }
}, { _id: false });

const NFTSchema = new Schema({
    contractAddress: {
        type: String,
        required: true,
    },
    tokenId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    external_url: {
        type: String,
    },
    attributes: [AttributeSchema],
}, { timestamps: true });

module.exports = mongoose.model('NFT', NFTSchema);
