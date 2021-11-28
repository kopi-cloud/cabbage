import {appTitle} from "App";
import React from "react";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorsScreenPath} from "./VendorsScreen";
import {useLocationPathname} from "Component/Location/UseLocationPathname";
import {Link} from "Component/Location/Link";

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
  const {pathname} = useLocationPathname();
  if( !isVendorsScreenPath(pathname) ){
    return null;
  }
  
  const vendorId = parseVendorId(pathname);
  if( !vendorId ){
    return <h3>Unable to parse vendorId from location</h3>
  }
  
  window.document.title = `${appTitle} / Vendor / ${vendorId}`
  return <Content vendorId={vendorId}/>;
}

function Content({vendorId}: {vendorId: string}){
  return <>
    <h1>Vendor Detail screen</h1>

    <Link href={getHomeScreenPath()}>Home</Link>
    
    &emsp;
    
    <Link href={getVendorsScreenPath()}>Vendors</Link>
    
    <h3>Vendor ID: {vendorId}</h3>
    <div>Name: xxx</div>
    <div>Description: xxx</div>
  </>
}