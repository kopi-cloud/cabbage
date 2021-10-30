import React, {useEffect, useState} from 'react';
import {useLocation} from "Component/UseLocation";
import {windowTitle} from "App";
import {listVendors, VendorSummary} from "Component/ExampleApi";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorScreenPath} from "./VendorScreen";
import {LoadingIcon} from "Component/LoadingIcon";

const screenPath = "/vendors";

export function getVendorsScreenPath(){
  return screenPath;
}

function isVendorsScreenPath(location: string): boolean{
  return location === screenPath;
}

export function VendorsScreen(){
  const {currentLocation} = useLocation();
  if( !isVendorsScreenPath(currentLocation) ){
    return null;
  }
  window.document.title = windowTitle + " / Vendors"
  return <Content/>;
}

function Content(){
  const location = useLocation();
  return <>
    <h1>Vendor list screen</h1>
    <a href={getHomeScreenPath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getHomeScreenPath())
    }}>Home</a>
    <VendorList/>
  </>
}

function VendorList(){
  const location = useLocation();
  const [vendors, setVendors] = 
    useState(undefined as undefined|VendorSummary[]);
  
  useEffect(()=>{
    (async ()=>{
      setVendors(await listVendors());
    })();
  }, []);
  
  if( !vendors ){
    return <h3>loading vendors&nbsp;<LoadingIcon/></h3>
  }
  
  return <>
    <h2>Vendors</h2>
    <ul>{vendors.map((it)=>{
      return <a key={it.id} href={getVendorScreenPath(it.id)} 
        onClick={e=>{
          e.preventDefault();
          location.pushState(getVendorScreenPath(it.id))
        }}
      > 
        <li>{it.name}</li>
      </a>
    })}</ul>
  </>
}