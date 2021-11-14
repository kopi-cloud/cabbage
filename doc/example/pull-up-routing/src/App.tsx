import React from 'react';
import { HomeScreen } from 'Screen/HomeScreen';
import { VendorScreen } from 'Screen/VendorScreen';
import { VendorsScreen } from 'Screen/VendorsScreen';
import {LocationContextProvider} from "Location/UseLocationPathname";

// const log = console;

export const windowTitle = "pull-up-routing";

export function App(){
  return <>
    <LocationContextProvider>
      <HomeScreen/>
      <VendorsScreen/>
      <VendorScreen/>
    </LocationContextProvider>
  </>
}

