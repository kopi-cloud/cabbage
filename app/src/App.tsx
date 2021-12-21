import React from 'react';
import './App.css';
import {StyledEngineProvider, Theme, ThemeProvider} from "@mui/material/styles";
import {createTheme, CssBaseline} from "@mui/material";
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


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


export function App(){
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </StyledEngineProvider>
  );
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
export const theme = createTheme();
