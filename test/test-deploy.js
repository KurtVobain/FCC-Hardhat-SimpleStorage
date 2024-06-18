const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", () => {
    let SimpleStorageFactory, SimpleStorage;

    beforeEach(async () => {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        SimpleStorage = await SimpleStorageFactory.deploy();
    });

    it("Starts with a favourite number of 0", async () => {
        const currentValue = await SimpleStorage.retrieve();
        const excpectedValue = "0";
        assert.equal(currentValue.toString(), excpectedValue);
    });

    it("Updates when call store", async () => {
        const excpectedValue = 900;
        const transactionResponse = await SimpleStorage.store(excpectedValue);
        await transactionResponse.wait(1);
        const currentValue = await SimpleStorage.retrieve();
        assert.equal(currentValue.toString(), excpectedValue);
    });
});
