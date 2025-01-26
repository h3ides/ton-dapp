import { JettonBalance } from "@ton-api/client";
import { beginCell, Address, toNano } from "@ton/core";
import { SendTransactionRequest } from "@tonconnect/ui-react";

export const getJettonSendTransactionRequest = (
  jetton: JettonBalance,
  amountStr: string,
  recipientAddressStr: string,
  senderAddressStr: string
): SendTransactionRequest => {
  const amount = BigInt(amountStr);
  const recipient = Address.parse(recipientAddressStr);
  const sender = Address.parse(senderAddressStr);  // ✅ Convert senderAddress to Address type

  const body = beginCell()
    .storeUint(0xf8a7ea5, 32) // Jetton transfer operation
    .storeUint(0, 64) // Query ID
    .storeCoins(amount) // Jetton amount
    .storeAddress(recipient)
    .storeAddress(sender)  // ✅ Fix: Use Address type instead of string
    .storeUint(0, 1) // Empty payload
    .storeCoins(1n) // Forward TON amount
    .endCell();

  return {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: jetton.walletAddress.address.toRawString(),
        amount: toNano("0.05").toString(), // Estimated fee
        payload: body.toBoc().toString("base64"),
      },
    ],
  };
};
