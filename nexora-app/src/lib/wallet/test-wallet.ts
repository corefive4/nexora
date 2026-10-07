import {
  generatePrivateKey,
  privateKeyToAccount,
} from "viem/accounts";

export function createTestWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
  };
}
