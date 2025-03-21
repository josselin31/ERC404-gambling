const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy GamblingToken
  const GamblingToken = await hre.ethers.getContractFactory("GamblingToken");
  const gamblingToken = await GamblingToken.deploy();
  await gamblingToken.waitForDeployment();
  console.log("GamblingToken deployed to:", await gamblingToken.getAddress());

  // Deploy GamblingGame
  // Note: Replace these values with your actual Chainlink VRF configuration
  const vrfCoordinator = "YOUR_VRF_COORDINATOR_ADDRESS";
  const subscriptionId = "YOUR_SUBSCRIPTION_ID";
  const keyHash = "YOUR_KEYHASH";

  const GamblingGame = await hre.ethers.getContractFactory("GamblingGame");
  const gamblingGame = await GamblingGame.deploy(
    vrfCoordinator,
    await gamblingToken.getAddress(),
    subscriptionId,
    keyHash
  );
  await gamblingGame.waitForDeployment();
  console.log("GamblingGame deployed to:", await gamblingGame.getAddress());

  // Mint initial tokens to the gambling game contract
  const initialMint = hre.ethers.parseEther("1000000"); // 1 million tokens
  await gamblingToken.mint(await gamblingGame.getAddress(), initialMint);
  console.log("Minted initial tokens to gambling game contract");

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 