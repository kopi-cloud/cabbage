import React, {useEffect, useState} from 'react';
import {useLocation} from "Component/UseLocation";
import {getHomePagePath} from "Page/HomePage";
import {windowTitle} from "App";
import {listVendors, VendorSummary} from "Component/ExampleApi";
import {getVendorPagePath} from "Page/VendorPage";

const pagePath = "/vendors";

export function getVendorsPagePath(){
  return pagePath;
}

function isVendorsPagePath(location: string): boolean{
  return location === pagePath;
}

export function VendorsPage(){
  const {currentLocation} = useLocation();
  if( !isVendorsPagePath(currentLocation) ){
    return null;
  }
  window.document.title = windowTitle + " / Vendors"
  return <Content/>;
}

function Content(){
  const location = useLocation();
  return <>
    <h1>Vendor list page</h1>
    <a href={getHomePagePath()} onClick={(e)=>{
      e.preventDefault();
      location.pushState(getHomePagePath())
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
    return <h3>loading vendors...</h3>
  }
  
  return <>
    <h2>Vendors</h2>
    <ul>{vendors.map((it)=>{
      return <a key={it.id} href={getVendorPagePath(it.id)} 
        onClick={e=>{
          e.preventDefault();
          location.pushState(getVendorPagePath(it.id))
        }}
      > 
        <li>{it.name}</li>
      </a>
    })}</ul>
  </>
}