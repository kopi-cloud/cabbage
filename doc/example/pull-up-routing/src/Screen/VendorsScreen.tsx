import React, {useEffect, useState} from 'react';
import {windowTitle} from "App";
import {listVendors, VendorSummary} from "Component/ExampleApi";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorScreenPath} from "./VendorScreen";
import {LoadingIcon} from "Component/Icon";
import {useLocationPath} from "Location/UseLocationPath";
import {useIsMounted} from "Component/Util";

const screenPath = "/vendors";

export function getVendorsScreenPath(){
  return screenPath;
}

function isVendorsScreenPath(location: string): boolean{
  return location === screenPath;
}

export function VendorsScreen(){
  const {currentPath} = useLocationPath();
  if( !isVendorsScreenPath(currentPath) ){
    return null;
  }
  window.document.title = windowTitle + " / Vendors"
  return <Content/>;
}

function Content(){
  const location = useLocationPath();
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
  const location = useLocationPath();
  const isMounted = useIsMounted();
  const [vendors, setVendors] = 
    useState(undefined as undefined|VendorSummary[]);
  
  useEffect(()=>{
    (async ()=>{
      let result = await listVendors();
      if( isMounted.current ){
        setVendors(result);
      }
    })(); 
  }, [isMounted]);
  
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