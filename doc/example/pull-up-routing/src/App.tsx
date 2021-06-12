import React from 'react';
import { HomeScreen } from 'Screen/HomeScreen';
import { VendorScreen } from 'Screen/VendorScreen';
import { VendorsScreen } from 'Screen/VendorsScreen';

// const log = console;

export const windowTitle = "pull-up-routing";

export function App(){
  return <>
    <HomeScreen/>
    <VendorsScreen/>
    <VendorScreen/>
  </>
}

