import React, { useState, useEffect } from "react";
import Web3 from "web3";
import tokenAbi from '../../contracts/CustomToken.json';

const RightSidebar = ({ ipfsData }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");

    // Initialize Web3
    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            async function loadAccount() {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    console.log('accounts', accounts);
                    setAccount(accounts[0]);
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setBalance(web3.utils.fromWei(balance, "ether"));
                } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                }
            }
            loadAccount();
        } else {
            console.error("MetaMask is not installed!");
        }
    }, []);

    const sendTokens = async () => {
        if (!window.ethereum || !account) {
            console.error("MetaMask is not connected");
            return;
        }
    
        const web3 = new Web3(window.ethereum);
        const contractAddress = '0x91D320D94355ed6233D8E1eA35CCE843EeCEfB6e';
        const tokenContract = new web3.eth.Contract(tokenAbi.abi, contractAddress);
    
        try {
            setIsLoading(true);
            setStatus("");

            const gasPrice = await web3.eth.getGasPrice();

            console.log('recipient',recipient);
            console.log('amount',amount);

            const amountToSend = web3.utils.toWei(amount, "ether");
    
            const tx = await tokenContract.methods.transfer(recipient, amountToSend).send({
                from: account,
                gasPrice: gasPrice,
                gas: 200000,
            });
    
            setStatus("Transaction successful!");
            console.log(`Transaction hash: ${tx.transactionHash}`);
            setRecipient("");
            setAmount("");
    
            const updatedBalance = await tokenContract.methods.balanceOf(account).call();
            setBalance(web3.utils.fromWei(updatedBalance, "ether"));
        } catch (error) {
            console.error("Error sending transaction:", error);
            setStatus("Transaction failed. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };
    


    return (
        <div className="w-96 bg-gray-900 text-white p-6 fixed right-0 top-0 h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4"></h2>
            {account && (
                <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2">Current Account Balance</h3>
                    <p>
                        Address: <span className="text-gray-300">{account}</span>
                    </p>
                    <p>
                        Balance: <span className="text-gray-300">{balance} ETH</span>
                    </p>
                </div>
            )}

            {/* Send Ether Section */}
            <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Send Tokens</h3>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full mb-2 text-black"
                />
                <input
                    type="text"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full mb-2 text-black"
                />
                <button
                    onClick={sendTokens}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 ${isLoading ? "cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Ether"}
                </button>
                {status && <p className="mt-2 text-sm">{status}</p>}
            </div>

            {/* IPFS Data Table */}
            <h2 className="text-lg font-bold mb-4">Stored IPFS Data</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b border-gray-700 px-2 py-1">#</th>
                        <th className="border-b border-gray-700 px-2 py-1">CID</th>
                    </tr>
                </thead>
                <tbody>
                    {ipfsData.length > 0 ? (
                        ipfsData.map((data, index) => (
                            <tr key={index}>
                                <td className="border-b border-gray-700 px-2 py-1">{index + 1}</td>
                                <td
                                    className="border-b border-gray-700 px-2 py-1 cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(data.cid);
                                    }}
                                >
                                    {data.cid}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border-b border-gray-700 px-2 py-1 text-center" colSpan="2">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default RightSidebar;
