import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "./Home";

function Chat() {
  const { friendList } = useContext(FriendContext);
  return friendList.length > 0 ? (
    <VStack>
      <TabPanels>
        <TabPanel>friend one</TabPanel>
        <TabPanel>friend two</TabPanel>
      </TabPanels>
    </VStack>
  ) : (
    <VStack
      justify="center"
      pt="5rem"
      w="100%"
      textAlign="center"
      fontSize="lg"
    >
      <TabPanels>
        <Text>No friend:( Click add friend to start chatting</Text>
      </TabPanels>
    </VStack>
  );
}

export default Chat;
