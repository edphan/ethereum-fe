import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import { Center, Container, Button, Flex } from "@chakra-ui/react";
import SendTransaction from "./sendTransaction";

export default function Profile() {
  const { address, connector, isConnected } = useAccount();
  const {
    data,
    isError,
    isLoading: isLoadingBalance,
  } = useBalance({ address: address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const disconnectWallet = () => disconnect();

  if (isConnected) {
    return (
      <Container centerContent>
        <div>{address}</div>
        <div>Connected to {connector?.name}</div>
        {isLoadingBalance && <div>Balance loading...</div>}
        {isError && <div>Error loading balance</div>}
        {!isLoadingBalance && !isError && (
          <div>
            Balance: {data?.formatted} {data?.symbol}
          </div>
        )}
        <SendTransaction />
        <Button colorScheme="red" variant="ghost" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Center>
        {connectors.map((connector) => (
          <Button
            colorScheme="messenger"
            isLoading={isLoading}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
          </Button>
        ))}

        {error && <div>{error.message}</div>}
      </Center>
    </Container>
  );
}
