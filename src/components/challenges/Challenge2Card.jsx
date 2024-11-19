
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { LOCAL_API_URL } from "../../constants";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";

const queryWalletLogsUrl = `${LOCAL_API_URL}/wallet-logs`;

const Challenge2Card = () => {
    const [contractAddress, setContractAddress] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchAllWalletLogs = async () => {
        try {
            const response = await axios.get(`${queryWalletLogsUrl}`);
            if (response.data) {
                setLogs(response.data.logs);
            }
            setContractAddress("");
            setTokenId("");
        } catch (err) {
            console.error("Error fetching all NFTs:", err);
            onError("An error occurred while fetching all NFTs.");
        }
    };

    useEffect(() => {
        fetchAllWalletLogs();
    }, []);

    const handleSearch = async () => {
        if (!contractAddress) {
            setError('Please enter a wallet contractAddress.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(
                queryWalletLogsUrl,
                { contractAddress }
            );
            fetchAllWalletLogs();
        } catch (err) {
            setError('Error fetching wallet logs');
            console.error(err);
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
                    <h2 className="text-2xl font-bold ml-2">Wallet Last 5 Logs</h2>
                </div>
                <div className="flex items-center w-[500px]">
                    <input
                        type="text"
                        placeholder="Enter Ethereum Wallet Address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mr-4"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
                    >
                        <Search size={20} className="mr-1" />
                        Search
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 overflow-auto">
                    {loading && <p className="text-center text-gray-500">Loading...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {logs.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">Hash</TableHead>
                                    <TableHead className="font-bold">From</TableHead>
                                    <TableHead className="font-bold">To</TableHead>
                                    <TableHead className="font-bold">Value</TableHead>
                                    <TableHead className="font-bold">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{log.hash}</TableCell>
                                        <TableCell>{log.from}</TableCell>
                                        <TableCell>{log.to}</TableCell>
                                        <TableCell>{log.value}</TableCell>
                                        <TableCell>{new Date(log.timestamp * 1000).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        !loading && <p className="text-center text-gray-500">No logs to display</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Challenge2Card;
