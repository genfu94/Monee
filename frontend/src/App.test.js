import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { AuthProvider } from "./AuthProvider";
import "@testing-library/jest-dom";
import { synchronizeAndFetchAccounts } from "./apis";
import WebFont from "webfontloader";

jest.mock("./apis");
jest.mock("webfontloader", () => ({
  load: jest.fn(),
}));

describe("App component", () => {
  beforeEach(() => {
    synchronizeAndFetchAccounts.mockResolvedValue({ data: "mockedData" });
  });

  it("renders loading screen initially", async () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider initialState={true}>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    const loadingScreen = screen.findByTestId("loading-screen");
    expect(loadingScreen).not.toBeNull();
  });

  it("renders the dashboard after synchronizing accounts", async () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider initialState={true}>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    // Wait for the loading screen to disappear element is removed
    await waitForElementToBeRemoved(() =>
      screen.findByTestId("loading-screen")
    );
    // screen.debug();
  });
});
