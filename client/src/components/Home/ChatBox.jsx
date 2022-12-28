import { HStack, Input, Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import socket from "../../socket";
import { MessagesContext } from "./Home";

function ChatBox({ userId }) {
  const { setMessages } = useContext(MessagesContext);
  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({ message: Yup.string().min(1).max(255) })}
      onSubmit={(values, actions) => {
        const message = { to: userId, from: null, content: values.message };
        socket.emit("dm", message);
        setMessages((prevMsgs) => [message, ...prevMsgs]);
        actions.resetForm();
      }}
    >
      <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
        <Input
          as={Field}
          name="message"
          placeholder="Type message here..."
          size="lg"
          autoComplete="off"
        />
        <Button type="submit" size="lg" colorScheme="teal">
          Send
        </Button>
      </HStack>
    </Formik>
  );
}

export default ChatBox;
