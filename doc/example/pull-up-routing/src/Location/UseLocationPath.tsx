/**
 * Most of the logic in here comes from the wouter library, it's just
 * converted to Typescript and factored a little differently.
 *
 * https://github.com/molefrog/wouter/blob/master/use-location.js
 */
import React, {useEffect, useRef, useState} from "react";
import {
  installBrowserHistoryStateHandler,
} from "Location/LocationPatch";

export interface LocationPathState {
  currentLocationPath: string,
  replaceStateLocationPath: (to: string) => void,
  pushStateLocationPath: (to: string) => void,
}

export function useLocationPath(): LocationPathState{
  const [currentLocationPath, setCurrentLocationPath] =
    useState(window.location.pathname);
  const prevPath: React.MutableRefObject<string> = useRef(currentLocationPath);
  
  useEffect(() => {
    console.log("useLocationPath useEffect");
    return installBrowserHistoryStateHandler(() => {
      console.log("on history state change");
      /* Checks if the location has been changed since  last render and 
      updates the currentLocationPath state only when needed.

      In this way, we're using React state as a kind of event-observer pattern,
      updating the state "notifies" all the observers (components that use that
      state) and results in each one being rendered.
      Unfortunately, we can't rely on `window.location.pathname` directly 
      because it will already have been changed to the new value, so
      we track the previous pathname in a ref.
      */
      const pathname = window.location.pathname;

      if( prevPath.current === pathname ){
        return;
      }

      prevPath.current = pathname;
      setCurrentLocationPath(pathname);
    });
  }, []);

  // todo:sto start here  - this does not cause vendorsscreen to re-render when 
  //  clicking the vendors link, I don't get it
  
  console.log("useLocationPath() render returning", {currentLocationPath});
  return {
    currentLocationPath: currentLocationPath,
    replaceStateLocationPath: React.useCallback(to=>
      window.history.replaceState(null, "", to), []),
    pushStateLocationPath: React.useCallback(to=>
      window.history.pushState(null, "", to), []),
  }
}
