import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { Center, Container, Button, Flex } from "@chakra-ui/react";

export default function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const disconnectWallet = () => disconnect();

  if (isConnected) {
    return (
      <Container centerContent>
        <div>{address}</div>
        <div>Connected to {connector?.name}</div>
        <Button colorScheme="messenger" onClick={disconnectWallet}>
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
