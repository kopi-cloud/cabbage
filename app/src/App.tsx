import React from 'react';
import './App.css';

import {CssBaseline} from "@mui/material";
import {CabbageTheme} from "Design/CabbageTheme";
import {ReactErrorBoundary} from "Error/ReactErrorBoundary";
import {ErrorDialogProvider} from "Error/ErrorDialog";
import {NavigationProvider} from "Design/NavigationProvider";
import {SupabaseProvider} from "Api/SupabaseProvider";
import {AuthenticatedUserProvider} from "Api/AuthenticatedUserProvider";
import {AppNavBar} from "Design/AppNavBar";

import {UserEditScreen} from "Screen/User/UserEditScreen";
import {OtherScreen} from "Screen/OtherScreen";
import {ScratchScreen} from "Screen/ScratchScreen";
import {ErrorHandlingScreen} from "Screen/ErrorHandling";
import {DatabaseSchemaScreen} from "Screen/DatabaseSchemaScreen";
import {UserListScreen} from "Screen/User/UserListScreen";
import {UserDisplayScreen} from "Screen/User/UserDisplayScreen";
import { LocationPathnameProvider } from 'Util/Hook/UseLocationPathname';

export function App(){
  return <CabbageTheme>
    <CssBaseline/>
    <ReactErrorBoundary>
      <ErrorDialogProvider>
        <LocationPathnameProvider>
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
        </LocationPathnameProvider>
      </ErrorDialogProvider>
    </ReactErrorBoundary>
  </CabbageTheme>;
}
