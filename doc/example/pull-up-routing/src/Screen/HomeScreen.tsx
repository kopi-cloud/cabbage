import React from 'react';
import {CommitInfo} from "Component/CommitInfo";
import {windowTitle} from "App";
import {getVendorsScreenPath} from "./VendorsScreen";
import {useLocationPathname} from "Location/UseLocationPathname";

const screenPath = "/";

export function getHomeScreenPath(){
  return screenPath;
}

function isHomeScreenPath(location: string): boolean{
  return location === screenPath;
}

export function HomeScreen(){
  const {pathname} = useLocationPathname()
  if( !isHomeScreenPath(pathname) ){
    return null;
  }
  window.document.title = windowTitle + " / Home"
  return <Content/>;
}

function Content(){
  const location = useLocationPathname();
  return <div>
    <h1>Home Screen</h1>

    <div>pull-up-routing example project</div>
    <CommitInfo/>

    <h2>Navigations links</h2>
    <ul>
      <li><a href={getVendorsScreenPath()} onClick={(e)=>{
        e.preventDefault();
        location.pushState(getVendorsScreenPath())
      }}>Vendors</a></li>
    </ul>
  </div>
}
