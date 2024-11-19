import React, { useState } from 'react';
import Web3 from 'web3';
import tokenAbi from '../../contracts/CustomToken.json';

const Challenge4Card = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log("tokenAbi",tokenAbi);

  const web3 = new Web3('http://127.0.0.1:8545');

  const contractAddress = '0x91D320D94355ed6233D8E1eA35CCE843EeCEfB6e';
  const tokenContract = new web3.eth.Contract(tokenAbi.abi, contractAddress);

  const handleSearch = async () => {
    if (!web3.utils.isAddress(walletAddress)) {
      setError('Invalid wallet address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const balance = await tokenContract.methods.balanceOf(walletAddress).call();
      setBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (err) {
      setError('Error fetching token balance');
      console.error(err);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Check Token Balance</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full mr-4"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {balance !== null && (
        <div className="mt-4">
          <p className="text-lg">
            Balance: <span className="font-bold">{balance} CTK</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Challenge4Card;
