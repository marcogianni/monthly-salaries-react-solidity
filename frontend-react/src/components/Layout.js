import React from "react";
import styled from "styled-components";
import Container from "@mui/material/Container";

const StyledContainer = styled(Container)`
  padding-top: 100px;
`;

const Layout = ({ children }) => {
  return <StyledContainer maxWidth="lg">{children}</StyledContainer>;
};

export default Layout;
