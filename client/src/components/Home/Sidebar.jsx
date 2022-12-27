import {
  Button,
  Divider,
  Heading,
  HStack,
  TabList,
  VStack,
  Tab,
  Text,
  Circle,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { FriendContext } from "./Home";
import AddFriendModal from "./AddFriendModal";

function Sidebar() {
  const { friendList, setFriendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <VStack py="1.4rem">
        <HStack justify="space-around" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList.map((friend) => {
            return (
              <HStack as={Tab} key={friend.username}>
                <Circle
                  bg={friend.connected ? "green.700" : "red.500"}
                  w="10px"
                  h="10px"
                />
                <Text>{friend.username}</Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Sidebar;
