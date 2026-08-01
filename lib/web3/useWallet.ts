"use client";

import { useState, useCallback } from "react";
import { createWalletClient, custom, type WalletClient } from "viem";
import { sepolia } from "viem/chains";

interface WalletState {
  address: `0x${string}` | null;
  client: WalletClient | null;
  connecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    client: null,
    connecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setState((s) => ({ ...s, error: "No wallet found. Install MetaMask to continue." }));
      return;
    }

    setState((s) => ({ ...s, connecting: true, error: null }));

    try {
      const client = createWalletClient({
        chain: sepolia,
        transport: custom(ethereum),
      });

      const [address] = await client.requestAddresses();

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } catch {
        // If the switch is rejected, proceed anyway — the contract call
        // will fail clearly if they're on the wrong network.
      }

      setState({ address, client, connecting: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        connecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet.",
      }));
    }
  }, []);

  return { ...state, connect };
}