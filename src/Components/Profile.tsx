import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import { Center, Container, Button, Flex, Text } from "@chakra-ui/react";
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

  if (isConnected) {
    return (
      <Container centerContent>
        <Text>{address}</Text>
        <Text>Connected to {connector?.name}</Text>
        {isLoadingBalance && <div>Balance loading...</div>}
        {isError && <div>Error loading balance</div>}
        {!isLoadingBalance && !isError && (
          <Text>
            Balance: {data?.formatted} {data?.symbol}
          </Text>
        )}
        <SendTransaction />
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
