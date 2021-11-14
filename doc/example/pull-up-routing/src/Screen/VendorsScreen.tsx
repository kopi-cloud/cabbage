import React, {SyntheticEvent, useEffect, useState} from 'react';
import {windowTitle} from "App";
import {listVendors, VendorSummary} from "Component/ExampleApi";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorScreenPath} from "./VendorScreen";
import {LoadingIcon} from "Component/Icon";
import {useLocationPathname} from "Location/UseLocationPathname";
import {parseBoolean, useIsMounted} from "Component/Util";
import {
  LocationSearchContextProvider,
  useLocationSearch
} from "Location/UseLocationSearch";

const screenPath = "/vendors";

export function getVendorsScreenPath(){
  return screenPath;
}

function isVendorsScreenPath(location: string): boolean{
  return location === screenPath;
}

export function VendorsScreen(){
  const {pathname} = useLocationPathname();

  if( !isVendorsScreenPath(pathname) ){
    return null;
  }
  window.document.title = windowTitle + " / Vendors"
  return <Content/>;
}

function Content(){
  const location = useLocationPathname();
  return <>
    <h1>Vendor list screen</h1>
    <a href={getHomeScreenPath()} onClick={ e => {
      e.preventDefault();
      location.pushState(getHomeScreenPath())
    }}>Home</a>
    <LocationSearchContextProvider>
      <VendorList/>
    </LocationSearchContextProvider>
  </>
}

function VendorList(){
  const location = useLocationPathname();
  const search = useLocationSearch();
  const [options, setOptions] = useState({
    filterText: search.search.get("name") ?? "", 
    sortAscending: parseBoolean(search.search.get("ascending") || "true", true) });
  const isMounted = useIsMounted();
  const [vendors, setVendors] = 
    useState(undefined as undefined|VendorSummary[]);
  const [isListing, setIsListing] = useState(false);
  
  useEffect(()=>{
    (async ()=>{
      setIsListing(true);
      let result = await listVendors(options.filterText, options.sortAscending);
      if( isMounted.current ){
        setVendors(result);
        setIsListing(false);
      }
    })(); 
  }, [isMounted, setVendors, options]);
  
  return <>
    <h2>Vendors</h2>
    <CriteriaForm
      disabled={isListing} criteria={options} onChange={(newOptions)=>{
        search.replaceState(new URLSearchParams({
          name: newOptions.filterText,
          ascending: newOptions.sortAscending.toString() }));
        setOptions(newOptions);
    }} />

    <ul>
      { !vendors && <li>loading...</li> }
      { vendors?.map((it)=>{
        return <a key={it.id} href={getVendorScreenPath(it.id)} 
          onClick={e=>{
            e.preventDefault();
            location.pushState(getVendorScreenPath(it.id))
          }}
        > 
          <li>{it.name}</li>
        </a>
      })}
    </ul>
  </>
}

function CriteriaForm({disabled = false, criteria, onChange}:{
  disabled?: boolean,
  criteria: ListCriteria,
  onChange: (_: ListCriteria)=>void,
}){
  const [name, setName] = useState(criteria.filterText);
  const [ascending, setAscending] = useState(criteria.sortAscending);

  return <form onSubmit={(e: SyntheticEvent)=> {
    e.preventDefault();
    onChange({filterText: name, sortAscending: ascending});
  }}>
    <fieldset disabled={disabled} style={{display: "inline-flex", border: 0}}>
      <label>name:&nbsp;</label>
      <input type={"text"} value={name}
        onChange={(e)=>setName(e.target.value)} />
      &emsp;
      <label>ascending:&nbsp;</label>
      <input type="checkbox" checked={ascending} 
        onChange={()=> setAscending(!ascending)}/>
      &emsp;
      <button type="submit">search</button>
      {disabled && <LoadingIcon/>}
    </fieldset>
  </form>
}

interface ListCriteria {
  filterText: string,
  sortAscending: boolean,
}

