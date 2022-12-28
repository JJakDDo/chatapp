import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";
import TextField from "../TextField";
import socket from "../../socket";
import { useState, useCallback } from "react";
import { useContext } from "react";
import { FriendContext } from "./Home";

function AddFriendModal({ isOpen, onClose }) {
  const [error, setError] = useState("");
  const { setFriendList } = useContext(FriendContext);
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: "" }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required("Username required!")
              .min(6, "Username is too short!")
              .max(28, "Username is too long!"),
          })}
          onSubmit={(values, actions) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ errorMessage, done, newFriend }) => {
                if (done) {
                  setFriendList((c) => [newFriend, ...c]);
                  closeModal();
                  return;
                }
                setError(errorMessage);
              }
            );
          }}
        >
          <Form>
            <ModalBody>
              <Heading as="p" color="red.500" textAlign="center" fontSize="lg">
                {error}
              </Heading>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's username"
                autoComplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default AddFriendModal;
