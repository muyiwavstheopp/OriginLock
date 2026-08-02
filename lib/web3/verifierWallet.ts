import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { ORIGIN_LOCK_ABI, ORIGIN_LOCK_ADDRESS } from "@/lib/web3/contract";

const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!;
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY as `0x${string}`;

/**
 * Server-side wallet client for the verifier role — the address registered
 * via setVerifier() on-chain, allowed to call recordUsage(). This wallet
 * only pays its own gas; payment itself moves lab -> creator inside the
 * contract call, this wallet never holds creator or lab funds.
 */
export function getVerifierClients() {
  const account = privateKeyToAccount(VERIFIER_PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL),
  });

  return { walletClient, publicClient, account, abi: ORIGIN_LOCK_ABI, address: ORIGIN_LOCK_ADDRESS! };
}