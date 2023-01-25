import { Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { utils } from "ethers";

const SendTransaction = () => {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });

  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendTransaction?.();
  };

  return (
    <>
      <Text>Send ETH to an address</Text>
      <Input
        type="text"
        placeholder="Address"
        onChange={(e) => setTo(e.target.value)}
      ></Input>
      <Input
        type="number"
        placeholder="ETH"
        onChange={(e) => setAmount(e.target.value)}
      ></Input>
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      <Button
        isLoading={isLoading}
        colorScheme="messenger"
        disabled={!sendTransaction || !to || !amount}
        onClick={handleSubmit}
      >
        {isLoading ? "Loading..." : "Send ETH transaction"}
      </Button>
    </>
  );
};

export default SendTransaction;
