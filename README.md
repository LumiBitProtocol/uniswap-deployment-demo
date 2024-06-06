# Uniswap V2 Deployment with Hardhat and Lumibit Ethers

This project demonstrates how to deploy Uniswap V2 contracts using Hardhat and Lumibit Ethers. It includes the deployment of the `UniswapV2Factory`, `WETH9`, `UniswapV2Pair` and `UniswapV2Router02` contracts.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)
- [Hardhat](https://hardhat.org/)
- [Lumibit Ethers](https://github.com/LumiBitProtocol/lumibit-ethers) (v1.1.3 or later)

## Getting Started

Follow these steps to set up the project and deploy the Uniswap V2 contracts.

### 1. Install Dependencies

Create a new directory for your project and navigate into it:

```bash
npm install
```

### 2. Write deployment script like below
```typescript

import { BTCNetwork, ContractFactory, JsonRpcProvider, Wallet } from "@lumibit/ethers";
import { PRIVATE_KEY } from "./constants";
import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const getContractFactory = async (hre: HardhatRuntimeEnvironment, name: string, wallet?: Wallet) => {
    const artifact = await hre.artifacts.readArtifact(name);
    const contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, BTCNetwork.Testnet, wallet);
    return contractFactory;
}
async function main() {
    const deployer = new Wallet(PRIVATE_KEY, new JsonRpcProvider('https://rpc.devnet.lumibit.xyz', BTCNetwork.Testnet))

    console.log("Deploying contracts with the account:", deployer.address);
    // Deploy Uniswap V2 Factory
    const UniswapV2Factory = await getContractFactory(hre, "UniswapV2Factory", deployer);
    const factory = await UniswapV2Factory.deploy(deployer.address);
    await factory.waitForDeployment()
    console.log("UniswapV2Factory deployed to:", await factory.getAddress());

    // Deploy erc20 (Wrapped Ether)
    const UniswapV2ERC20 = await getContractFactory(hre, "UniswapV2ERC20", deployer);
    const erc20 = await UniswapV2ERC20.deploy();
    await erc20.waitForDeployment()
    console.log("V2ERC20 deployed to:", await erc20.getAddress());

    // Deploy Uniswap V2 Pair
    const UniswapV2Pair = await getContractFactory(hre, "UniswapV2Pair", deployer);
    const pair = await UniswapV2Pair.deploy();
    await pair.waitForDeployment()
    console.log("UniswapV2Pair deployed to:", await pair.getAddress());

    // Deploy WETH
    const WETH = await getContractFactory(hre, "WETH9", deployer);
    const weth = await WETH.deploy();
    await weth.waitForDeployment()
    console.log("WETH deployed to:", await weth.getAddress());

    // Deploy Uniswap V2 Router
    const UniswapV2Router = await getContractFactory(hre, "UniswapV2Router02", deployer);
    const router = await UniswapV2Router.deploy(await factory.getAddress(), await weth.getAddress());
    await router.waitForDeployment()
    console.log("UniswapV2Router deployed to:", await router.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

### 3. Run the Deployment Script
```
npx hardhat run scripts/deploy-uniswap-v2-core.ts
```

Then you will see the output like below
```
Deploying contracts with the account: tb1qfugnr4u7xy4ddqpvhhgncjlemuy6sfncq2kktj
UniswapV2Factory deployed to: tb1qf67jv33ukchsfajzjl8smpwhgwu4e7npuxzrk3
V2ERC20 deployed to: tb1q7eh3wg8534hgcege8a4zv4rfvlc695hyc8ptc7
UniswapV2Pair deployed to: tb1qunrr77vgzlmduwd66c5a0p6nw6txz5rznflml2
WETH deployed to: tb1qhjny5ahjz8k6wc7cy8fjsvxrllrshjympyf022
UniswapV2Router deployed to: tb1qtc9q6urz2hakp5gj527jg0g29llx5fvmx29cz6
```

And you can check the deployed contracts on [LumiBit Explorer](https://scan.devnet.lumibit.xyz/)
for instance, the link of the deployed UniswapV2Factory contract is [here](https://scan.devnet.lumibit.xyz/address/tb1qf67jv33ukchsfajzjl8smpwhgwu4e7npuxzrk3)
