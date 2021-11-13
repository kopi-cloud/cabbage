/**
 * The basic idea comes from the wouter library, it's just
 * converted to Typescript and factored a little differently (e.g. uses React
 * Context instead of an event listener chain).
 * Note that wouter has moved on and gotten more complicated since then.
 * https://github.com/molefrog/wouter/blob/a6c1eeda1ebc6b98d5ef4bffcfcfd43fae7937c3/use-location.js
 */
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

export interface LocationPathState {
  /** tracks window.location.pathname */
  currentPath: string,
  replaceState: (path: string) => void,
  pushState: (path: string) => void,
}

const LocationPathContext = React.createContext({} as LocationPathState);
export const useLocationPath = () => useContext(LocationPathContext);

export function LocationContextProvider({children}: {
  children: React.ReactNode
}){
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const replaceState = useCallback(path => {
    if( !originalFunctions ){
      console.warn("replaceState callback invoked before listener installed");
      return;
    }
    originalFunctions.replaceState(null, "", path);
    setCurrentPath(path);
  }, [setCurrentPath]);
  const pushState = useCallback(path => {
    if( !originalFunctions ){
      console.warn("replaceState callback invoked before listener installed");
      return;
    }
    originalFunctions.pushState(null, "", path);
    setCurrentPath(path);
  }, [setCurrentPath]);
  
  const state = useRef({currentPath, replaceState, pushState});

  /* intercepts forward/back browser actions ("popstate" event), or other 
  non-project javascript calls to window.history.pushState()/replaceState() */
  const onHistoryStateChange = React.useCallback(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  useEffect(() => {
    addListener(onHistoryStateChange);
    return () => removeListener(onHistoryStateChange);
  }, [onHistoryStateChange]);

  /* If path hasn't changed, don't make a new state, so Provider has same 
  `value` object and users of `useLocationPath()` will not be re-rendered.
  If path has changed, updating the `value` object is what triggers anything
  in our App that cares about the path (screens, menus, etc.) to re-render. */
  if( currentPath !== state.current.currentPath ){
    state.current = {currentPath, replaceState, pushState};
  }

  return <LocationPathContext.Provider value={state.current}>
    {children}
  </LocationPathContext.Provider>;
}
