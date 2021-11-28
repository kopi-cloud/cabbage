import React, {SyntheticEvent, useEffect, useState} from 'react';
import {appTitle} from "App";
import {listVendors, VendorSummary} from "Util/ExampleApi";
import {getHomeScreenPath} from "./HomeScreen";
import {getVendorScreenPath} from "./VendorScreen";
import {LoadingIcon} from "Component/Icon";
import {useLocationPathname} from "Component/Location/UseLocationPathname";
import {
  LocationSearchProvider, LocationSearchState, 
  useLocationSearch
} from "Component/Location/UseLocationSearch";
import {parseBoolean} from "Util/Location";
import {useIsMounted} from "Component/HookUtil";
import {formatPath, isPathname} from "Util/Location";
import {Link} from "Component/Location/Link";

const screenPath = "/vendors";

export function getVendorsScreenPath(params?: ListCriteria){
  if( !params ){
    return screenPath;
  }
  
  return formatPath(screenPath, formatSearchState(params));
}

function isVendorsScreenPath(location: string): boolean{
  return isPathname(screenPath, location);
}

export function VendorsScreen(){
  const {pathname} = useLocationPathname();

  if( !isVendorsScreenPath(pathname) ){
    return null;
  }
  return <>
    <h1>Vendor list screen</h1>
    <Link href={getHomeScreenPath()}>Home</Link>
    <LocationSearchProvider>
      <VendorList/>
    </LocationSearchProvider>
  </>
}

function VendorList(){
  const searchContext = useLocationSearch<VendorListSearchState>();
  const [criteria, setCriteria] = useState(parseSearchState(searchContext));
  
  const isMounted = useIsMounted();
  const [vendors, setVendors] = 
    useState(undefined as undefined|VendorSummary[]);
  const [isListing, setIsListing] = useState(false);

  // must be under LocationSearchProvider if title uses search params
  window.document.title = formatWindowTitle(searchContext.search)

  useEffect(()=>{
    (async ()=>{
      setIsListing(true);
      let result = await listVendors(
        criteria.filterText, criteria.sortAscending );
      if( isMounted.current ){
        setVendors(result);
        setIsListing(false);
      }
    })(); 
  }, [isMounted, setVendors, criteria]);
  
  return <>
    <h2>Vendors</h2>
    <CriteriaForm
      disabled={isListing} criteria={criteria} onChange={(newOptions)=>{
        setCriteria(newOptions);
        searchContext.replaceState(formatSearchState(newOptions));
    }} />

    <ul>
      { !vendors && <li>loading...</li> }
      { vendors?.map((it)=>{
        return <Link key={it.id} href={getVendorScreenPath(it.id)}> 
          <li>{it.name}</li>
        </Link>
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

/* Yes, you could use TS typing to create a new interface where the types are
all strings. Resist that temptation.  The similarities between the criteria
and the state are coincidental, not intrinsic; borne of this example's 
simplicity.    
*/
interface ListCriteria {
  filterText: string,
  sortAscending: boolean,
}

export type VendorListSearchState = {
  name: string,
  ascending: string,
}

function formatWindowTitle(search: VendorListSearchState){
  let newTitle = appTitle + " / Vendors";
  if( search.name ){
    newTitle += ` (${search.name})`
  }
  return newTitle  
}

function formatSearchState(newOptions: ListCriteria): VendorListSearchState{
  return {
    name: newOptions.filterText,
    ascending: newOptions.sortAscending.toString()
  };
}

function parseSearchState(
  searchContext: LocationSearchState<VendorListSearchState>
): ListCriteria{
  return {
    filterText: searchContext.search.name ?? "",
    sortAscending: parseBoolean(searchContext.search, "ascending") ?? true
  };
}


