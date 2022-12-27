import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "../TextField";

function AddFriendModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
            onClose();
          }}
        >
          <Form>
            <ModalBody>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's username"
                autocomplete="off"
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
