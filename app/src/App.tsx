import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {WelcomeScreen} from "Screen/WelcomeScreen";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";
import {SupabaseProvider} from "Api/SupabaseProvider";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <SupabaseProvider>
          <WelcomeScreen/>
        </SupabaseProvider>
      </ErrorDialogProvider>
    </ReactErrorBoundary>
  </MuiThemeProvider>;
}

export const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
      },
    },
  }
});
