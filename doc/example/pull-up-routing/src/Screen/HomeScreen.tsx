import React from 'react';
import {CommitInfo} from "Component/CommitInfo";
import {appTitle} from "App";
import {getVendorsScreenPath} from "./VendorsScreen";
import {useLocationPathname} from "Component/Location/UseLocationPathname";
import {Link} from "Component/Location/Link";

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
  window.document.title = appTitle + " / Home"
  return <Content/>;
}

function Content(){
  return <div>
    <h1>Home Screen</h1>

    <div>{appTitle} example project</div>
    <CommitInfo/>

    <h2>Navigations links</h2>
    <ul>
      <li><Link href={getVendorsScreenPath()}>Vendors</Link></li>
    </ul>
    
    <h4>Shortcut links</h4>
    <ul>
      <li><Link href={
        getVendorsScreenPath({filterText: "blue", sortAscending: true })
      }>"Blue" Vendors</Link></li>
      <li><Link href={
        getVendorsScreenPath({filterText: "purple", sortAscending: true })
      }>"Purple" Vendors</Link></li>
    </ul>
  </div>
}
