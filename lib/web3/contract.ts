export const ORIGIN_LOCK_ABI = [
  {
    type: "function",
    name: "register",
    stateMutability: "nonpayable",
    inputs: [
      { name: "contentHash", type: "bytes32" },
      { name: "paymentToken", type: "address" },
      { name: "pricePerUse", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "records",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "paymentToken", type: "address" },
      { name: "pricePerUse", type: "uint256" },
      { name: "registeredAt", type: "uint64" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "recordUsage",
    stateMutability: "nonpayable",
    inputs: [
      { name: "contentHash", type: "bytes32" },
      { name: "licensee", type: "address" },
      { name: "licenseScope", type: "string" },
    ],
    outputs: [{ name: "useIndex", type: "uint256" }],
  },
  {
    type: "event",
    name: "UsageRecorded",
    inputs: [
      { name: "contentHash", type: "bytes32", indexed: true },
      { name: "licensee", type: "address", indexed: true },
      { name: "amountPaid", type: "uint256", indexed: false },
      { name: "useIndex", type: "uint256", indexed: false },
      { name: "licenseScope", type: "string", indexed: false },
    ],
  },
  {
    type: "error",
    name: "AlreadyRegistered",
    inputs: [],
  },
  {
    type: "error",
    name: "UnknownContent",
    inputs: [],
  },
  {
    type: "error",
    name: "ContentInactive",
    inputs: [],
  },
  {
    type: "error",
    name: "NotVerifier",
    inputs: [],
  },
] as const;

// Circle's official USDC on Ethereum Sepolia
export const SEPOLIA_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const;

export const ORIGIN_LOCK_ADDRESS = process.env
  .NEXT_PUBLIC_ORIGINLOCK_CONTRACT_ADDRESS as `0x${string}` | undefined;