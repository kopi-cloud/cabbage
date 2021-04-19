import React from 'react';
import {CommitInfo} from "Component/CommitInfo";
import {useLocation} from "Component/UseLocation";
import {getVendorsPagePath} from "Page/VendorsPage";
import {windowTitle} from "App";

const pagePath = "/";

export function getHomePagePath(){
  return pagePath;
}

function isHomePagePath(location: string): boolean{
  return location === pagePath;
}

export function HomePage(){
  const {currentLocation} = useLocation()
  if( !isHomePagePath(currentLocation) ){
    return null;
  }
  window.document.title = windowTitle + " / Home"
  return <Content/>;
}

function Content(){
  const location = useLocation();
  return <div>
    <h1>Home Page</h1>

    <div>pull-up-routing example project</div>
    <CommitInfo/>

    <h2>Navigations links</h2>
    <ul>
      <li><a href={getVendorsPagePath()} onClick={(e)=>{
        e.preventDefault();
        location.pushState(getVendorsPagePath())
      }}>Vendors</a></li>
    </ul>
  </div>
}
