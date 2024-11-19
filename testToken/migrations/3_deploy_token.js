const CustomToken = artifacts.require("CustomToken");

module.exports = function (deployer) {
    const initialSupply = web3.utils.toWei('1000', 'ether');
    deployer.deploy(CustomToken, initialSupply);
};
