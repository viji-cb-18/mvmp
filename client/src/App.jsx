import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./routes/AppRouter";

const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={3000} />
    <AppRouter />
  </>
);

export default App;

