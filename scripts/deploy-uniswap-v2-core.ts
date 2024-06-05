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
