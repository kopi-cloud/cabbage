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
import {SignupScreen} from "Screen/Welcome/SignupScreen";
import {UserScreen} from "Screen/UserScreen";
import {AuthenticatedUserProvider} from "Api/AuthenticatedUserProvider";
import {OtherScreen} from "Screen/OtherScreen";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <NavigationProvider>
          <SupabaseProvider>
            <IndexScreen/>
            <WelcomeScreen/>
            <SignupScreen/>
            <AuthenticatedUserProvider>
              <UserScreen/>
              <OtherScreen/>
            </AuthenticatedUserProvider>
          </SupabaseProvider>
        </NavigationProvider>
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
