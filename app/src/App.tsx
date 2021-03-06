import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";
import {SupabaseProvider} from "Api/SupabaseProvider";
import {NavigationProvider} from "Navigation/NavigationProvider";
import {UserEditScreen} from "Screen/User/UserEditScreen";
import {AuthenticatedUserProvider} from "Api/AuthenticatedUserProvider";
import {OtherScreen} from "Screen/OtherScreen";
import {AppNavBar} from "Navigation/AppNavBar";
import {ScratchScreen} from "Screen/ScratchScreen";
import {ErrorHandlingScreen} from "Screen/ErrorHandling";
import {DatabaseSchemaScreen} from "Screen/DatabaseSchemaScreen";
import {UserListScreen} from "Screen/User/UserListScreen";
import {UserDisplayScreen} from "Screen/User/UserDisplayScreen";

export function App(){
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <NavigationProvider>
          <SupabaseProvider>
            <AuthenticatedUserProvider>
              <AppNavBar/>
              <UserEditScreen/>
              <UserListScreen/>
              <UserDisplayScreen/>
              <OtherScreen/>
              <ScratchScreen/>
              <ErrorHandlingScreen/>
              <DatabaseSchemaScreen/>
            </AuthenticatedUserProvider>
          </SupabaseProvider>
        </NavigationProvider>
      </ErrorDialogProvider>
    </ReactErrorBoundary>
  </MuiThemeProvider>;
}

export const navbarDarkBgColor = "#343a40";

/* V4 global theming

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

 */

// V5-alpha.18 global theming
export const theme = createMuiTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: navbarDarkBgColor,
        },
      },
    },
    MuiDrawer: {
      defaultProps: {
        // for dealing with "scroll-jumping" caused by m-ui
        // see https://stackoverflow.com/a/65174620/924597
        disableScrollLock: true,
      }
    },
    MuiMenu: {
      defaultProps: {disableScrollLock: true}
    },
    MuiPopover: {
      defaultProps: {disableScrollLock: true}
    },
    MuiDialog: {
      defaultProps: {disableScrollLock: true}
    },
  },
});
