import { useContext } from "react";
import { useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

function useSocketSetup(setFriendList) {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });

    socket.on("friends", (friendList) => setFriendList(friendList));

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
    };
  }, [setUser]);
}

export default useSocketSetup;
