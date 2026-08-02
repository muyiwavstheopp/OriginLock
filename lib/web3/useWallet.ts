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
      return null;
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
          params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
        });
      } catch {
        // If the switch is rejected, we still proceed — the contract call
        // itself will fail clearly if they're on the wrong network.
      }

      setState({ address, client, connecting: false, error: null });
      return { address, client };
    } catch (err) {
      setState((s) => ({
        ...s,
        connecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet.",
      }));
      return null;
    }
  }, []);

  // Full Sign-In-With-Ethereum flow: connect (if needed) -> fetch a fresh
  // nonce -> sign a message containing it -> POST to /api/auth/verify,
  // which checks the signature server-side and issues a session cookie.
  const signIn = useCallback(async (): Promise<{ address: string } | null> => {
    let active = state.client && state.address ? state : await connect();
    if (!active?.client || !active?.address) return null;

    const nonceRes = await fetch("/api/auth/nonce");
    const { nonce, token } = await nonceRes.json();

    const message = `Sign in to OriginLock.\n\nThis proves you control this wallet. No transaction, no gas.\n\nNonce: ${nonce}`;

    const signature = await active.client.signMessage({
      account: active.address,
      message,
    });

    const verifyRes = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: active.address, message, signature, nonce, token }),
    });

    if (!verifyRes.ok) {
      const data = await verifyRes.json().catch(() => ({}));
      setState((s) => ({ ...s, error: data.error ?? "Sign-in failed." }));
      return null;
    }

    const data = await verifyRes.json();
    return { address: data.address };
  }, [state, connect]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
  }, []);

  return { ...state, connect, signIn, signOut };
}