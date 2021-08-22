import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useLocationPath} from "Location/UseLocationPath";
import {windowTitle} from "App";
import {listVendors, VendorSummary} from "Component/ExampleApi";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorScreenPath} from "./VendorScreen";

const screenPath = "/vendors";

function formatHref(url: string, params: Record<string, any>){
  const urlSearchParams = new URLSearchParams();
  for( const iKey in params ){
    urlSearchParams.set(iKey, params[iKey]?.toString());
  }
  return `${url}?${urlSearchParams}`;
}

export function getVendorsScreenPath(
  options: ListCriteria = {filterText:"", sortAscending:true}
){
  return formatHref(screenPath, options);
}

function isVendorsScreenPath(location: string): boolean{
  return location.startsWith(screenPath);
}

export function VendorsScreen(){
  const [options, setOptions] =
    useState({filterText: "", sortAscending: true});
  const {currentLocationPath} = useLocationPath();
  
  const searchParams  = new URLSearchParams(currentLocationPath);
  console.log("VendorsScreen render", {
    currentLocationPath: currentLocationPath, 
    search: Array.from(searchParams.entries())
  });
  
  if( !isVendorsScreenPath(currentLocationPath) ){
    return null;
  }
  window.document.title = windowTitle + " / Vendors"
  return <Content options={options} onChange={setOptions}/>;
}

function Content({options, onChange}: {
  options: ListCriteria,
  onChange: (_: ListCriteria)=>void
}){
  const location = useLocationPath();
  // const options: ListCriteria = {filterText: "", sortAscending: true};

  return <>
    <h1>Vendor list screen</h1>
    <a href={getHomeScreenPath()} onClick={(e)=>{
      e.preventDefault();
      location.pushStateLocationPath(getHomeScreenPath())
    }}>Home</a> 
    <VendorList listOptions={options} onChange={onChange}/>
  </>
}

function VendorList({listOptions, onChange}: {
  listOptions: ListCriteria, 
  onChange: (_: ListCriteria)=>void
}){
  const location = useLocationPath();
  const [vendors, setVendors] = 
    useState(undefined as undefined|VendorSummary[]);
  const [isListing, setIsListing] = useState(false);
  
  // function onListOptionChange(newOptions: ListCriteria){
  //   setListOptions(newOptions);
  //   location.replaceState("");
  // }
  
  useEffect(()=>{
    (async ()=>{
      setIsListing(true);
      setVendors(await listVendors());
      setIsListing(false);
    })();
  }, []);

  if( !vendors ){
    return <h3>loading vendors...</h3>
  }
  
  let displayVendors = filterAndSortList(vendors, listOptions);

  return <>
    <h2>Vendors</h2>
    <CriteriaForm  
      disabled={isListing} criteria={listOptions} onChange={onChange} />
    <ul>{displayVendors.map((it)=>{
      return <a key={it.id} href={getVendorScreenPath(it.id)} 
        onClick={e=>{
          e.preventDefault();
          location.pushStateLocationPath(getVendorScreenPath(it.id))
        }}
      > 
        <li>{it.name}</li>
      </a>
    })}</ul>
  </>
}

function CriteriaForm({disabled = false, criteria, onChange}:{
  disabled?: boolean,
  criteria: ListCriteria,
  onChange: (_: ListCriteria)=>void,
}){
  const [filterText, setFilterText] = useState(criteria.filterText);
  
  return <form onSubmit={(e: SyntheticEvent)=> {
    e.preventDefault();
    onChange({...criteria, filterText});
  }}>
    <fieldset disabled={disabled}>
      <input type={"text"} value={filterText} 
        onChange={(e)=>setFilterText(e.target.value)} />
      <button type="submit">filter</button>
      <input type="checkbox" checked={criteria.sortAscending} onChange={()=> {
        onChange({...criteria, sortAscending: !criteria.sortAscending});
      }} />
    </fieldset>
  </form>
}

interface ListCriteria {
  filterText: string,
  sortAscending: boolean,
}

function filterAndSortList(
  vendors: VendorSummary[],
  listOptions: ListCriteria
){
  let displayVendors = vendors.filter(i => {
    return i.name.toLowerCase().includes(listOptions.filterText.toLowerCase())
  }).sort((left, right) => left.name.localeCompare(right.name));
  if( !listOptions.sortAscending ){
    displayVendors = displayVendors.reverse();
  }
  return displayVendors;
}

