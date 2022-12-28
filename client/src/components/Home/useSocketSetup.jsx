import { useContext } from "react";
import { useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

function useSocketSetup(setFriendList, setMessages, toast) {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });

    socket.on("friends", (friendList) => setFriendList(friendList));
    socket.on("messages", (messages) => setMessages(messages));
    socket.on("dm", (message) => {
      setMessages((prevMessage) => [message, ...prevMessage]);
    });
    socket.on("notification", (message) => {
      toast({
        position: "top",
        title: message,
      });
      console.log(message);
    });

    socket.on("connected", (status, username) => {
      setFriendList((prevFriends) => {
        const friends = [...prevFriends];
        return friends.map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }

          return friend;
        });
      });
    });

    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friends");
      socket.off("messages");
      socket.off("dm");
      socket.off("notification");
    };
  }, [setUser, setFriendList, setMessages, toast]);
}

export default useSocketSetup;
