import React from 'react';
import {HomePage} from "Page/HomePage";
import {VendorPage} from "Page/VendorPage";
import {VendorsPage} from "Page/VendorsPage";

// const log = console;

export const windowTitle = "simple-pull-routing";

export function App(){
  return <>
    <HomePage/>
    <VendorsPage/>
    <VendorPage/>
  </>
}

