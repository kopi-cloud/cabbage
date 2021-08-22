import React from 'react';
import {PersonStateScreen} from "Screen/PersonStateScreen";
import {HomeScreen} from "Screen/HomeScreen";
import {PersonContextScreen} from "Screen/PersonContextScreen";


export const windowTitle = "pull-up-routing";

export function App(){
  return <>
    <HomeScreen/>
    <PersonStateScreen/>
    <PersonContextScreen/>
  </>
}

