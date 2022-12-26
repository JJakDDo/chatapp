import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";

function Views() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route paht="*" element={<Login />} />
    </Routes>
  );
}

export default Views;
