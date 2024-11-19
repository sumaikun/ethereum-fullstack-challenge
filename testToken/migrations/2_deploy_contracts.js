const HelloWorld = artifacts.require("HelloWorld");

module.exports = function (deployer) {
    const initialMessage = "Hello, Initial World!";
    deployer.deploy(HelloWorld, initialMessage);
};
