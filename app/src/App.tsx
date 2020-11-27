import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {WelcomeScreen} from "Screen/WelcomeScreen";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <WelcomeScreen/>
      </ErrorDialogProvider>
    </ReactErrorBoundary>
  </MuiThemeProvider>;
};

export const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
      },
    },
  }
});
