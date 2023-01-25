import {
  Button,
  Container,
  Flex,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  useDisconnect,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { utils } from "ethers";

const SendTransaction = ({ balance }: { balance: string | undefined }) => {
  const { disconnect } = useDisconnect();
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const [isToError, setIsToError] = useState(false);
  const [isAmountError, setIsAmountError] = useState(false);
  const [isNotEnoughEth, setIsNotEnoughEth] = useState(false);

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
    if (to === "" && amount === "") {
      setIsToError(true);
      setIsAmountError(true);
      return;
    }
    if (to === "") {
      setIsToError(true);
      return;
    }
    if (amount === "") {
      setIsAmountError(true);
      return;
    }
    if (parseInt(amount, 10) > parseInt(balance || "", 10)) {
      setIsNotEnoughEth(true);
      return;
    }

    e.preventDefault();
    sendTransaction?.();
  };

  const handleDisconnect = () => disconnect();

  return (
    <Container display="flex" flexDirection="column" gap="10px">
      <Text as="b">Send ETH to an address</Text>
      <FormControl isRequired isInvalid={isToError}>
        <FormLabel>Account address</FormLabel>
        <Input
          type="text"
          placeholder="0xA0Cf…251e"
          onChange={(e) => {
            if (isToError) setIsToError(false);
            setTo(e.target.value);
          }}
        ></Input>
      </FormControl>
      <FormControl isRequired isInvalid={isAmountError}>
        <FormLabel>Amount ETH to send</FormLabel>
        <Input
          type="number"
          placeholder="ETH"
          onChange={(e) => {
            if (isAmountError) setIsAmountError(false);
            setAmount(e.target.value);
          }}
        ></Input>
        {isNotEnoughEth && <Text color="red">Not enough ETH balance</Text>}
      </FormControl>
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      <Flex justify="flex-end" gap="20px">
        <Button colorScheme="red" variant="link" onClick={handleDisconnect}>
          Disconnect
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="messenger"
          disabled={!sendTransaction || !to || !amount}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Send ETH transaction"}
        </Button>
      </Flex>
    </Container>
  );
};

export default SendTransaction;
