import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field, useField } from "formik";
import React from "react";

function TextField({ label, ...props }) {
  const [field, meta] = useField(props.name);
  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel fontSize="lg">{label}</FormLabel>
      <Input as={Field} {...field} {...props}></Input>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

export default TextField;
