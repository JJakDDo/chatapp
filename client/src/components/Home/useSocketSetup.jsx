import { useContext } from "react";
import { useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

function useSocketSetup() {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });

    return () => {
      socket.off("connect_error");
    };
  }, [setUser]);
}

export default useSocketSetup;
