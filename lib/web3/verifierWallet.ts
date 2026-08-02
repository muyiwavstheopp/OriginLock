import { ethers } from "ethers";
import OriginLockABI from "@/contracts/out/OriginLock.sol/OriginLock.json";

const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY!;

let cachedContract: ethers.Contract | null = null;

/**
 * Returns a contract instance signed by the verifier wallet — the address
 * registered via setVerifier() on-chain, allowed to call recordUsage().
 * This wallet needs a small amount of Sepolia ETH to pay gas; it never
 * holds creator or lab funds itself, those move directly lab -> creator.
 */
export function getVerifierContract(): ethers.Contract {
  if (cachedContract) return cachedContract;

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(VERIFIER_PRIVATE_KEY, provider);
  cachedContract = new ethers.Contract(CONTRACT_ADDRESS, OriginLockABI.abi, signer);

  return cachedContract;
}