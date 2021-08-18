async function main() {
    // We get the contract to deploy

    const NapaCryptoSpaceMarket = await ethers.getContractFactory("NapaCryptoSpaceMarket");
    const SpaceToken = await ethers.getContractFactory("SpaceToken");

    const SP = await SpaceToken.deploy("http://napaglobal.com/");
    const CryptoSpace = await NapaCryptoSpaceMarket.deploy(SP.address);

    console.log("Space Token deployed to:", SP.address);
    console.log("CryptoSpace deployed to:", CryptoSpace.address);

    await SP.mintBatch721Token(12);
    const accounts = await web3.eth.getAccounts();
    await SP.setApprovalForAll(CryptoSpace.address, true, { from: accounts[0] });
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
