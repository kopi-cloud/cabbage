import {useLocation} from "Component/UseLocation";
import {windowTitle} from "App";
import React from "react";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorsScreenPath} from "./VendorsScreen";

export {};

const screenPath = "/vendor/";

export function getVendorScreenPath(vendorId: string){
  return screenPath + vendorId;
}

function isVendorsScreenPath(location: string): boolean{
  return location.startsWith(screenPath);
}

function parseVendorId(location: string): string | undefined{
  if( !location.startsWith(screenPath) ){
    return undefined;
  }

  let segments = location.split('/');
  return segments[segments.length - 1];
}


export function VendorScreen(){
  const {currentLocation} = useLocation();
  if( !isVendorsScreenPath(currentLocation) ){
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
    <h1>Vendor Detail screen</h1>

    <a href={getHomeScreenPath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getHomeScreenPath())
    }}>Home</a>
    
    &emsp;
    
    <a href={getVendorsScreenPath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getVendorsScreenPath())
    }}>Vendors</a>
    
    <h3>Vendor ID: {vendorId}</h3>
    <div>Name: xxx</div>
    <div>Description: xxx</div>
  </>
}