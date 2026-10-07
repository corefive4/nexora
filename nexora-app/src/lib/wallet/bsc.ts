import {
  createPublicClient,
  http,
} from "viem";
import { bsc } from "viem/chains";

const bscRpcUrl =
  import.meta.env.VITE_BSC_RPC_URL;

if (!bscRpcUrl) {
  throw new Error(
    "Missing VITE_BSC_RPC_URL",
  );
}

export const bscClient =
  createPublicClient({
    chain: bsc,
    transport: http(bscRpcUrl),
  });
