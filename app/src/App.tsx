import React from 'react';
import './App.css';
import {CssBaseline} from "@mui/material";
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
import {CabbageTheme} from "Component/CabbageTheme";

export function App(){
  return <CabbageTheme>
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
  </CabbageTheme>;
}
