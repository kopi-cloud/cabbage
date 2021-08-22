import React from 'react';
import {CommitInfo} from "Component/CommitInfo";

const screenPath = "/";

export function getHomeScreenPath(){
  return screenPath;
}

// function isHomeScreenPath(location: string): boolean{
//   return location === screenPath;
// }

export function HomeScreen(){
  window.document.title = "context-observer / Home"
  return <Content/>;
}

function Content(){
  return <div>
    <h1>Home Screen</h1>

    <div>context-observer demonstration project</div>
    <CommitInfo/>
  </div>
}
