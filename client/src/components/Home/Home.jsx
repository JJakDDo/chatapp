import { Grid, GridItem, Tabs, useToast } from "@chakra-ui/react";
import { createContext, useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import useSocketSetup from "./useSocketSetup";

export const FriendContext = createContext();
export const MessagesContext = createContext();

function Home() {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendIndex, setFriendIndex] = useState(0);
  const toast = useToast();

  useSocketSetup(setFriendList, setMessages, toast);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid
        templateColumns="repeat(10, 1fr)"
        h="100vh"
        as={Tabs}
        onChange={(index) => setFriendIndex(index)}
      >
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7" maxH="100vh">
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <Chat userId={friendList[friendIndex]?.userId} />
          </MessagesContext.Provider>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
}

export default Home;
