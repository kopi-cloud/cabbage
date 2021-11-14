import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  addListener,
  originalFunctions,
  removeListener
} from "Location/HistoryPatch";

export interface LocationSearchState {
  /** tracks window.location.search */
  search: URLSearchParams,
  replaceState: (params: URLSearchParams) => void,
  pushState: (params: URLSearchParams) => void,
}

// TODO:STO figure out a better way to do this
const LocationSearchContext = React.createContext(undefined as any as LocationSearchState);
export const useLocationSearch = () => useContext(LocationSearchContext);

function makePath(search: URLSearchParams): string{
  return window.location.pathname + "?" + search.toString();
}

export function LocationSearchContextProvider({children}: {
  children: React.ReactNode
}){
  const [search, setSearch] = useState(window.location.search);
  const replaceState = useCallback((params: URLSearchParams) => {
    if( !originalFunctions ){
      console.warn("replaceState callback invoked before listener installed");
      return;
    }
    originalFunctions.replaceState(null, "", makePath(params));
    setSearch(params.toString());
  }, [setSearch]);
  const pushState = useCallback(params => {
    if( !originalFunctions ){
      console.warn("pushState callback invoked before listener installed");
      return;
    }
    originalFunctions.pushState(null, "", makePath(params));
    setSearch(params.toString());
  }, [setSearch]);
  
  const state = useRef({search: new URLSearchParams(search), replaceState, pushState});

  /* intercepts forward/back browser actions ("popstate" event), or other 
  non-project javascript calls to window.history.pushState()/replaceState() */
  const onHistoryStateChange = React.useCallback(() => {
    setSearch(window.location.search);
  }, []);
  useEffect(() => {
    addListener(onHistoryStateChange);
    return () => removeListener(onHistoryStateChange);
  }, [onHistoryStateChange]);

  /* If path hasn't changed, don't make a new state, so Provider has same 
  `value` object and users of `useLocationPath()` will not be re-rendered.
  If path has changed, updating the `value` object is what triggers anything
  in our App that cares about the path (screens, menus, etc.) to re-render. */
  if( search !== state.current.search.toString() ){
    state.current = {search: new URLSearchParams(search), replaceState, pushState};
  }

  return <LocationSearchContext.Provider value={state.current}>
    {children}
  </LocationSearchContext.Provider>;
}
