import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { getJettonSendTransactionRequest } from "../utils/jetton-transfer";
import { JettonBalance } from "@ton-api/client";

interface SendJettonModalProps {
  jetton: JettonBalance;
  senderAddress: string;
  onClose: () => void;
}

const SendJettonModal: React.FC<SendJettonModalProps> = ({ jetton, senderAddress, onClose }) => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [tonConnectUI] = useTonConnectUI();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const transaction = getJettonSendTransactionRequest(
        jetton, amount, recipient, senderAddress
      );

      await tonConnectUI.sendTransaction(transaction);
      alert("Transfer successful!");
      onClose();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <h2>Send {jetton.jetton.name}</h2>
      {error && <p>{error}</p>}
      <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient Address" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button onClick={handleSubmit}>Send</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default SendJettonModal;
