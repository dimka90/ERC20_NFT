const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20, Staking and NFT Contracts", function () {
  let erc20Contract, stakingContract, nftContract, owner, addr1, addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ERC20 Contract
    const ERC20Factory = await ethers.getContractFactory("ERC20");
    const initialSupply = 5000;
    erc20Contract = await ERC20Factory.deploy(initialSupply);
    await erc20Contract.deployed();

    // Deploy Staking Contract
    const StakingContractFactory = await ethers.getContractFactory("Staking");
    stakingContract = await StakingContractFactory.deploy(erc20Contract.address);
    await stakingContract.deployed();

    // Deploy NFT Contract
    const NFTFactory = await ethers.getContractFactory("OnChainNFT");
    nftContract = await NFTFactory.deploy();
    await nftContract.deployed();
  });

  // ------------------------- ERC20 Tests -------------------------

  it("Should deploy ERC20 with the correct initial supply", async function () {
    const totalSupply = await erc20Contract.totalSupply();
    expect(totalSupply).to.equal(5000);
  });

  it("Should allow transfers between accounts", async function () {
    await erc20Contract.transfer(addr1.address, 100);
    const balanceAddr1 = await erc20Contract.balanceOf(addr1.address);
    expect(balanceAddr1).to.equal(100);
  });

  // ------------------------- Staking Contract Tests -------------------------

  it("Should create a staking pool", async function () {
    const poolName = "Test Pool";
    const rewardsRate = ethers.utils.parseEther("0.01");
    await stakingContract.createPool(poolName, rewardsRate);
    const pool = await stakingContract.pools(0);
    expect(pool.name).to.equal(poolName);
    expect(pool.rewardsRate).to.equal(rewardsRate);
  });

  it("Should allow staking tokens", async function () {
    // Approve staking contract to spend tokens
    const stakeAmount = ethers.utils.parseEther("10");
    await erc20Contract.approve(stakingContract.address, stakeAmount);

    // Create pool
    const poolName = "Test Pool";
    const rewardsRate = ethers.utils.parseEther("0.01");
    await stakingContract.createPool(poolName, rewardsRate);

    // Stake tokens
    await stakingContract.stake(0, stakeAmount);

    const userStake = await stakingContract.userStakes(0, owner.address);
    expect(userStake.amount).to.equal(stakeAmount);
  });

  it("Should allow unstaking tokens", async function () {
    const stakeAmount = ethers.utils.parseEther("10");
    await erc20Contract.approve(stakingContract.address, stakeAmount);
    await stakingContract.createPool("Test Pool", ethers.utils.parseEther("0.01"));
    await stakingContract.stake(0, stakeAmount);

    // Unstake tokens
    await stakingContract.unstake(0, stakeAmount);
    const userStake = await stakingContract.userStakes(0, owner.address);
    expect(userStake.amount).to.equal(0);
  });


  // setting values for a 
   it("It should be able to stake", async function () {
    amount = 10,
    await expect(erc20Contract.stake(amount))
    .to.emit(erc20Contract.target, amount)
    .withArgs(amount);
   });

  it("Should calculate rewards correctly", async function () {
    const stakeAmount = ethers.utils.parseEther("10");
    await erc20Contract.approve(stakingContract.address, stakeAmount);
    await stakingContract.createPool("Test Pool", ethers.utils.parseEther("0.01"));
    await stakingContract.stake(0, stakeAmount);

    // Simulate some time passing for rewards to accrue
    // Assume that each block rewards the user
    await ethers.provider.send("evm_increaseTime", [60 * 60]); // Increase by 1 hour
    await ethers.provider.send("evm_mine");

    await stakingContract.claimRewards(0);

    const userStake = await stakingContract.userStakes(0, owner.address);
    expect(userStake.rewards).to.be.gt(0); // Check that rewards are greater than zero
  });

  // ------------------------- NFT Contract Tests -------------------------

  it("Should mint an NFT with SVG data", async function () {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'>
        <defs><clipPath id='a'><path d='M0 0h1024v1024H0z'/></clipPath></defs>
        <g clip-path='url(#a)'>
          <path d='M0 0h1024v1024H0z'/>
          <path fill='#fff' d='M0 241h1024v20H0zM0 502h1024v20H0zM0 763h1024v20H0z'/>
          <path fill='#fff' d='M241 0h20v1024h-20z'/>
        </g>
      </svg>`;

    const txn = await nftContract.mint(addr1.address, svg, 1);
    await txn.wait();

    const ownerOfNFT = await nftContract.ownerOf(1);
    expect(ownerOfNFT).to.equal(addr1.address);
  });
});
