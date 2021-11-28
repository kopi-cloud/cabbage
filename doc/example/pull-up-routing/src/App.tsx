import React from 'react';
import { HomeScreen } from 'Screen/HomeScreen';
import { VendorScreen } from 'Screen/VendorScreen';
import { VendorsScreen } from 'Screen/VendorsScreen';
import {LocationPathnameProvider} from "Component/Location/UseLocationPathname";

// const log = console;

export const appTitle = "self-routing";

export function App(){
  return <>
    <LocationPathnameProvider>
      <HomeScreen/>
      <VendorsScreen/>
      <VendorScreen/>
    </LocationPathnameProvider>
  </>
}

