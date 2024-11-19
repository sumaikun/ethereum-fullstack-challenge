import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { LOCAL_API_URL } from "../../constants";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table";

const getNftsUrl = `${LOCAL_API_URL}/nfts`;

const getNftMetaData = `${LOCAL_API_URL}/nfts/metadata`;

const Challenge1Card = ({ onError }) => {
    const [contractAddress, setContractAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [nftData, setNftData] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchAllNFTs = async () => {
        try {
            const response = await axios.get(`${getNftsUrl}`);
            if (response.data) {
                setNftData(response.data.nfts);
            }
            setContractAddress("");
            setTokenId("");
        } catch (err) {
            console.error("Error fetching all NFTs:", err);
            onError("An error occurred while fetching all NFTs.");
        }
    };

    useEffect(() => {
        fetchAllNFTs();
    }, []);

    const handleSearch = async () => {
        if (!contractAddress || !tokenId) {
            onError("Please enter both contract address and token ID.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${getNftMetaData}`,
                { contractAddress, tokenId }
            );

            if (response.data) {
                setNftData([response.data.nft]);
                fetchAllNFTs();
            } else {
                onError("No NFT data found for the provided input.");
            }
        } catch (err) {
            console.error("Error fetching NFT data:", err);
            onError("An error occurred while fetching NFT data.");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-w-4xl ml-0 mx-auto bg-white shadow-lg rounded-lg p-4 my-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={toggleExpand}>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <h2 className="text-2xl font-bold ml-2">Get NFT Info</h2>
                </div>
                <div className="flex items-center w-[600px]">
                    <input
                        type="text"
                        placeholder="Enter Contract Address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mr-4"
                    />
                    <input
                        type="text"
                        placeholder="Enter Token ID"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mr-4 w-[150px]"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                            <Search size={16} className="mr-1" />
                        )}
                        {loading ? 'Loading...' : 'Search'}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4">
                    {nftData && nftData.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">Contract Address</TableHead>
                                    <TableHead className="font-bold">Token ID</TableHead>
                                    <TableHead className="font-bold">Name</TableHead>
                                    <TableHead className="font-bold">Description</TableHead>
                                    <TableHead className="font-bold">Image</TableHead>
                                    <TableHead className="font-bold">Attributes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nftData.map((nft, index) => (
                                    <TableRow key={index}>
                                        <TableCell >{nft.contractAddress}</TableCell>
                                        <TableCell >{nft.tokenId}</TableCell>
                                        <TableCell >{nft.name}</TableCell>
                                        <TableCell >{nft.description}</TableCell>
                                        <TableCell>
                                            <a href={nft.image} target="_blank" rel="noopener noreferrer">
                                                <img src={nft.image} alt={nft.name} className="w-16 h-16 object-cover" />
                                            </a>
                                        </TableCell>
                                        <TableCell >
                                            {nft.attributes ? (
                                                <ul className="list-disc ml-4">
                                                    {nft.attributes.map((attr, idx) => (
                                                        <li key={idx}>
                                                            <strong>{attr.trait_type}:</strong> {attr.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No attributes</p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-gray-500">No data to display</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Challenge1Card;
