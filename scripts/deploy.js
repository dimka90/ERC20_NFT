
  const hre = require("hardhat");

const main = async () => {

  // Get the contract factory
  const ERC20Factory = await hre.ethers.getContractFactory("ERC20");

  // Deploy the contract with the initial supply (e.g., 1000 tokens)
  const initialSupply = 1200
  const erc20Contract = await ERC20Factory.deploy(initialSupply);

  // Wait for the contract to be deployed
  await erc20Contract.deployed;
const result = await erc20Contract.totalSupply();

console.log("Total supply", result)
  // Log the contract address
  console.log("ERC20 Contract deployed to:", erc20Contract.target);
  

  // Stalking contract
  const StakingContractFactory = await hre.ethers.getContractFactory("Staking");
  const stakingContract = await StakingContractFactory.deploy(erc20Contract.target); // Pass token address to staking contract
  await stakingContract.deployed;
  console.log(`✅ Staking Contract deployed at: ${stakingContract.target}`);
  const poolName = "My Staking Pool";
  const rewardsRate = hre.ethers.parseEther("0.01"); // Rewards rate per block (or use per second)
  let transaction = await stakingContract.createPool(poolName, rewardsRate);
  await transaction.wait();
  console.log(`✅ Staking pool created with name: ${poolName}`);


  const nftContractFactory = await hre.ethers.getContractFactory('OnChainNFT');

  const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed;
    console.log('✅ NFTContract deployed to:', nftContract.target);

  
  // aproving 
  const stakeAmount = hre.ethers.parseEther("10");
  staketxn = await erc20Contract.approve(stakingContract.target, stakeAmount);
  await staketxn.wait();
  console.log(`✅ Approved staking contract to spend tokens`);


  const poolId = 0; // Assuming this is the first pool created
  txntoken = await stakingContract.stake(poolId, 10);

  txntoken = await stakingContract.unstake(poolId, 10);

  console.log(txntoken)

  await txntoken.wait();
  // console.log(`✅ Staked ${hre.ether.formatEther(stakeAmount)} tokens in pool ID ${poolId}`);
    // SVG image that you want to mint
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'>
        <defs><clipPath id='a'><path d='M0 0h1024v1024H0z'/></clipPath></defs>
        <g clip-path='url(#a)'>
          <path d='M0 0h1024v1024H0z'/>
          <path fill='#fff' d='M0 241h1024v20H0zM0 502h1024v20H0zM0 763h1024v20H0z'/>
          <path fill='#fff' d='M241 0h20v1024h-20z'/>
        </g>
      </svg>`;
  
    // Call the mint function from our contract
    const txn = await nftContract.mint("0x1864cdF30E6B98240e4b3eF88bfF5cD5d5BdEF40", svg, 1);
    const txnReceipt = await txn.wait();

    console.log(nftContract.target)

    
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
