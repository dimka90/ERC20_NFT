// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./erctoken.sol"; // Import your ERC20 contract

contract Staking {
    struct Pool {
        string name;
        uint256 totalStaked;
        uint256 rewardsRate; // rewards rate per block or per second
    }

    struct UserStake {
        uint256 amount;
        uint256 rewards;
    }

    ERC20 public token; // The ERC20 token being staked

    uint256 public poolCount; // Track the number of pools created

    mapping(uint256 => Pool) public pools; // Mapping of pools by ID
    mapping(uint256 => mapping(address => UserStake)) public userStakes; // User stakes per pool

    event Staked(address indexed user, uint256 poolId, uint256 amount);
    event Unstaked(address indexed user, uint256 poolId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 poolId, uint256 amount);

    constructor(address tokenAddress) {
        token = ERC20(tokenAddress);
    }

    function createPool(string memory name, uint256 rewardsRate) external {
        // Increment the pool count to get a new unique poolId
       

        // Use the incremented poolCount as the new poolId
        pools[poolCount] = Pool({
            name: name,
            totalStaked: 0,
            rewardsRate: rewardsRate
        });
         poolCount++;
    }

    function stake(uint256 poolId, uint256 amount) external {
        require(pools[poolId].rewardsRate > 0, "Pool does not exist");
        require(amount > 0, "Amount must be greater than zero");

        token.transferFrom(msg.sender, address(this), amount);
        userStakes[poolId][msg.sender].amount += amount;
        pools[poolId].totalStaked += amount;

        emit Staked(msg.sender, poolId, amount);
    }

    function unstake(uint256 poolId, uint256 amount) external {
        require(pools[poolId].rewardsRate > 0, "Pool does not exist");
        require(userStakes[poolId][msg.sender].amount >= amount, "Insufficient staked amount");

        userStakes[poolId][msg.sender].amount -= amount;
        pools[poolId].totalStaked -= amount;

        token.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, poolId, amount);
    }

    function claimRewards(uint256 poolId) external {
        require(pools[poolId].rewardsRate > 0, "Pool does not exist");

        uint256 rewards = userStakes[poolId][msg.sender].amount * pools[poolId].rewardsRate;
        userStakes[poolId][msg.sender].rewards += rewards;

        // Transfer rewards to the user (implement your logic here)
        // Example: token.transfer(msg.sender, rewards); (ensure you have enough tokens in the contract)

        emit RewardsClaimed(msg.sender, poolId, rewards);
    }
}
