import React from "react";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

import { Layout, Navbar } from "components";
import Front from "./Front";

import "./App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastContainer
        limit={4}
        autoClose={3500}
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
      />

      <ThemeProvider theme={theme}>
        <Navbar />
        <Layout>
          <Front />
        </Layout>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default App;
