import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {WelcomeScreen} from "Screen/Welcome/WelcomeScreen";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";
import {SupabaseProvider} from "Api/SupabaseProvider";
import {NavigationProvider} from "Navigation/NavigationProvider";
import {IndexScreen} from "Screen/IndexScreen";
import {SignupScreen} from "Screen/SignupScreen";
import {UserScreen} from "Screen/UserScreen";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <SupabaseProvider>
          <NavigationProvider>
            <IndexScreen/>
            <WelcomeScreen/>
            <SignupScreen/>
            <UserScreen/>
          </NavigationProvider>
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
