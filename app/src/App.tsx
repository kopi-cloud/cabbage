import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";
import {SupabaseProvider} from "Api/SupabaseProvider";
import {NavigationProvider} from "Navigation/NavigationProvider";
import {UserScreen} from "Screen/UserScreen";
import {AuthenticatedUserProvider} from "Api/AuthenticatedUserProvider";
import {OtherScreen} from "Screen/OtherScreen";
import {AppNavBar} from "Navigation/AppNavBar";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <NavigationProvider>
          <SupabaseProvider>
            <AuthenticatedUserProvider>
              <AppNavBar/>
              <UserScreen/>
              <OtherScreen/>
            </AuthenticatedUserProvider>
          </SupabaseProvider>
        </NavigationProvider>
      </ErrorDialogProvider>
    </ReactErrorBoundary>
  </MuiThemeProvider>;
}

export const navbarDarkBgColor = "#343a40";

export const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: navbarDarkBgColor,
      },
    },
  },
  props: {
    MuiModal: {
      // for dealing with "scroll-jumping" caused by m-ui
      // see https://stackoverflow.com/a/65174620/924597
      disableScrollLock: true,
    },
  },
});
