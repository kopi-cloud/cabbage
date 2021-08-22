/**
 * Most of the logic in here comes from the wouter library, it's just
 * converted to Typescript and factored a little differently.
 * Note that I looked at the Wouter code originally back in Approx Jan 2020,
 * it has been improved significantly since then, but this code has not been
 * updated to reflect any of those changes.
 *
 * https://github.com/molefrog/wouter/blob/bdcb3a4dc152fb998b669d218e4b3a299e4fafb1/use-location.js
 */
import React, {useEffect, useRef, useState} from "react";

export interface LocationState {
  currentLocation: string,
  replaceState: (to: string) => void,
  pushState: (to: string) => void,
}

export function useLocation(): LocationState{
  const [currentLocation, setCurrentLocation] =
    useState(currentWindowLocation());
  const prevPath = useRef(currentLocation);

  useEffect(() => {
    patchHistoryEvents();

    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the previous pathname in a ref.
    const checkForUpdates = () => {
      const pathname = currentWindowLocation();
      if( prevPath.current !== pathname ){
        prevPath.current = pathname;
        setCurrentLocation(pathname);
      }
    };

    const events = ["popstate", "pushState", "replaceState"];
    events.map(e => window.addEventListener(e, checkForUpdates));

    /* it's possible that an update has occurred between render and the effect
     handler, so we run additional check on mount to catch these updates.
     Based on:
     https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189  */
    checkForUpdates();

    return () => {
      events.map(e => window.removeEventListener(e, checkForUpdates));
    };
  }, []);

  return {
    currentLocation: currentLocation,
    replaceState: React.useCallback(to=>
      window.history.replaceState(null, "", to), []),
    pushState: React.useCallback(to=>
      window.history.pushState(null, "", to), []),
  }
}

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031

let patched = false;

type WindowHistoryFn =
  (data: any, title: string, url?: (string | null)) => void;

function patchHistoryPushState(){
  const original: WindowHistoryFn = window.history.pushState;

  window.history.pushState = function(data: any, title: string, url?: (string | null)): void{
    const result = original.apply(this, [data, title, url]);
    const event = new Event("pushState");
    // @ts-ignore
    event.arguments = arguments;

    dispatchEvent(event);
    return result;
  };
}

function patchHistoryReplaceState(){
  const original: WindowHistoryFn = window.history.replaceState;

  window.history.replaceState = function(data: any, title: string, url?: (string | null)): void{
    const result = original.apply(this, [data, title, url]);
    const event = new Event("replaceState");
    // @ts-ignore
    event.arguments = arguments;

    dispatchEvent(event);
    return result;
  }
}

const patchHistoryEvents = ():void => {
  if (patched) return;
  patchHistoryPushState();
  patchHistoryReplaceState();
  patched = true;
};

function currentWindowLocation(): string{
  return window.location.pathname;
}


