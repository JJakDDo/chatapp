import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import ChatBox from "./ChatBox";
import { FriendContext, MessagesContext } from "./Home";

function Chat({ userId }) {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const bottomDiv = useRef(null);

  useEffect(() => {
    bottomDiv.current?.scrollIntoView();
  });

  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {friendList.map((friend) => (
          <VStack
            flexDir="column-reverse"
            as={TabPanel}
            key={`chat:${friend.username}`}
            w="100%"
          >
            <div ref={bottomDiv} />
            {messages
              .filter(
                (msg) => msg.to === friend.userId || msg.from === friend.userId
              )
              .map((message, index) => (
                <Text
                  m={
                    message.to === friend.userId
                      ? "1rem 0 0 auto !important"
                      : "1rem auto 0 0 !important"
                  }
                  maxWidth="50%"
                  key={`msg:${friend.username}.${index}`}
                  fontSize="lg"
                  bg={message.to === friend.userId ? "blue.100" : "gray.100"}
                  color="gray.800"
                  borderRadius="10px"
                  p="0.5rem 1rem"
                >
                  {message.content}
                </Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userId={userId} />
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
