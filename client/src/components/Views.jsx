import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import PrivateRoutes from "./PrivateRoutes";
import SignUp from "./Login/SignUp";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import { Text } from "@chakra-ui/react";

function Views() {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<div>Hi welcome</div>} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default Views;
