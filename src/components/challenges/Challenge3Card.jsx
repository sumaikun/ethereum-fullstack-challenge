import React, { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { LOCAL_API_URL } from "../../constants";

const saveIpfsUrl = `${LOCAL_API_URL}/ipfs/save`;
const retrieveIpfsUrl = `${LOCAL_API_URL}/ipfs/retrieve`;

const Challenge3Card = ({ fetchIPFSData }) => {
    const [content, setContent] = useState('');
    const [retrievedContent, setRetrievedContent] = useState('');
    const [error, setError] = useState('');
    const [searchCid, setSearchCid] = useState('');
    const [cid, setCid] = useState('');

    const handleAddToIPFS = async () => {
        try {
            const response = await axios.post(saveIpfsUrl, { content });
            setCid(response.data.cid);
            setRetrievedContent('');
            setError('');
            fetchIPFSData();
        } catch (err) {
            setError('Failed to add data to IPFS');
            console.error(err);
        }
    };

    const handleGetFromIPFS = async () => {
        try {
            setCid('');
            console.log('searchCid',searchCid);
            const response = await axios.get(retrieveIpfsUrl, {
                params: {
                    cid: searchCid,
                },
            });
            setRetrievedContent(response.data.content);
            setError('');
        } catch (err) {
            setError('Failed to retrieve data from IPFS');
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl ml-0 mx-auto bg-white shadow-lg rounded-lg p-8 my-6">
            <h2 className="text-2xl font-bold mb-4">IPFS Storage</h2>
            <textarea
                placeholder="Enter content to store on IPFS"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md mb-4"
                rows="4"
            ></textarea>
            <button
                onClick={handleAddToIPFS}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 mb-6"
            >
                Add to IPFS
            </button>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search for IPFS CID"
                    value={searchCid}
                    onChange={(e) => setSearchCid(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full mr-4"
                />
                <button
                    onClick={handleGetFromIPFS}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
                >
                    <Search size={20} className="mr-1" />
                    Search
                </button>
            </div>

            {cid && (
                <p className="mt-4 text-gray-500">
                    <strong>Stored CID:</strong> {cid}
                </p>
            )}

            {retrievedContent && (
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <p><strong>Retrieved Content:</strong></p>
                    <p>{retrievedContent}</p>
                </div>
            )}

            {error && (
                <p className="text-red-500 mt-4">{error}</p>
            )}
        </div>
    );
};

export default Challenge3Card;
