import React from "react";
import {getStateScreenPath} from "Screen/PersonStateScreen";
import {getContextScreenPath} from "Screen/PersonContextScreen";
import {CommitInfo} from "Component/CommitInfo";

const screenPath = "/";

export function getHomeScreenPath(){
  return screenPath;
}

function isHomeScreenPath(location: string): boolean{
  return location === screenPath;
}

export function HomeScreen(){
  if( !isHomeScreenPath(window.location.pathname) ){
    return null;
  }
  window.document.title = "context-observer / Home"
  return <Content/>;
}

function Content(){
  return <div>
    <CommitInfo/>
    <ul>
      <li><a href={getStateScreenPath()}>State screen</a></li>
      <li><a href={getContextScreenPath()}>Context screen</a></li>
    </ul>
  </div>
}
