// import React from 'react';
import {useLocation} from "Component/UseLocation";
import {windowTitle} from "App";
import React from "react";
import {getHomePagePath} from "Page/HomePage";
import {getVendorsPagePath} from "Page/VendorsPage";

export {};

const pagePath = "/vendor/";

export function getVendorPagePath(vendorId: string){
  return pagePath + vendorId;
}

function isVendorsPagePath(location: string): boolean{
  return location.startsWith(pagePath);
}

function parseVendorId(location: string): string | undefined{
  if( !location.startsWith(pagePath) ){
    return undefined;
  }

  let segments = location.split('/');
  return segments[segments.length - 1];
}


export function VendorPage(){
  const {currentLocation} = useLocation();
  if( !isVendorsPagePath(currentLocation) ){
    return null;
  }
  
  const vendorId = parseVendorId(currentLocation);
  if( !vendorId ){
    return <h3>Unable to parse vendorId from location</h3>
  }
  
  window.document.title = `${windowTitle} / Vendor / ${vendorId}`
  return <Content vendorId={vendorId}/>;
}

function Content({vendorId}: {vendorId: string}){
  const location = useLocation();
  
  return <>
    <h1>Vendor Detail page</h1>

    <a href={getHomePagePath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getHomePagePath())
    }}>Home</a>
    
    &emsp;
    
    <a href={getVendorsPagePath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getVendorsPagePath())
    }}>Vendors</a>
    
    <h3>Vendor ID: {vendorId}</h3>
    <div>Name: xxx</div>
    <div>Description: xxx</div>
  </>
}