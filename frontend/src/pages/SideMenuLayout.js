import React from "react";
import NavBar from "../components/NavBar/Navbar.js";
import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";

const MainContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1100px",
  paddingTop: "1.4rem",
  alignSelf: "center",
  display: "flex",
}));

const SideMenuContainer = styled(Box)(({ theme }) => ({
  marginRight: "2rem",
  borderRadius: "0.4rem",
  backgroundColor: "#fafbfc",
  width: "15rem",
  padding: "1.3rem",
}));

class SideMenuLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <NavBar page={this.props.page} />
        <MainContainer>
          {this.props.sideMenuTitle && (
            <SideMenuContainer>
              <Typography variant="h1">{this.props.sideMenuTitle}</Typography>
              <Box>{this.props.sideMenuContent}</Box>
            </SideMenuContainer>
          )}
          <Box style={{ flex: 1 }}>{this.props.content}</Box>
        </MainContainer>
      </>
    );
  }
}

export default SideMenuLayout;
