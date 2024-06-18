const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage");
    const SimpleStorage = await SimpleStorageFactory.deploy();
    await SimpleStorage.deployed();

    console.log(`Deployed to ${SimpleStorage.address}`);
    if (
        network.config.chainId === parseInt(process.env.SEPOLIA_CHAIN_ID) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await SimpleStorage.deployTransaction.wait(6);
        await verify(SimpleStorage.address, []);
        console.log("Succesfully verified");
    }

    const currentValue = await SimpleStorage.retrieve();
    console.log(`Current number: ${currentValue}`);

    const transactionResponse = await SimpleStorage.store(99);
    await transactionResponse.wait(1);
    const updatedtValue = await SimpleStorage.retrieve();
    console.log(`Current number: ${updatedtValue}`);
}

async function verify(contractAddress, args) {
    console.log("Verifying contract");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
