
/**
 popstate is fired when user does something that causes the location to 
 change (forward, back button, etc).
 It *does not* get fired when the standard pushState()/replaceState()
 functions are invoked.

 See https://stackoverflow.com/a/4585031
 https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
 */
const StandardEventId = {
  popstate: "popstate",
};


// global flag to detect accidentally patching multiple times
let patched = false;

/** Sets up the browser so that the handler will be called when any code
 calls pushState() or replaceState() or the user takes an action that
 fires the "popstate" event.

 @return function that will uninstall or undefined if not patching happened 
 because it's already been called.
 */
export function installBrowserHistoryStateHandler(
  onHistoryStateChange: ()=>void,
): (() => void)|undefined{
  if( patched ){
    return undefined;
  }

  // fire when these functions are called
  const originalPushState = patchHistoryPushState(onHistoryStateChange);
  const originalReplaceState = patchHistoryReplaceState(onHistoryStateChange);
  patched = true;

  // fire when popstate occurs
  window.addEventListener(StandardEventId.popstate, onHistoryStateChange);


  /* it's possible that an update has occurred between render and the effect
   handler being attached above, so we run a manual check hereon mount to catch 
   those possible updates.
   Based on: https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189  
   */
  onHistoryStateChange();

  return () => {
    window.removeEventListener(StandardEventId.popstate, onHistoryStateChange);
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
  };

}

type WindowHistoryFn =
  (data: any, title: string, url?: (string | null)) => void;

function patchHistoryPushState(onPushState: WindowHistoryFn): WindowHistoryFn{
  const original: WindowHistoryFn = window.history.pushState;

  window.history.pushState = function(
    data: any, title: string, url?: (string | null)
  ): void{
    console.log("patchpush");
    original.apply(this, [data, title, url]);
    onPushState(data, title, url);
  };
  
  return original;
}

function patchHistoryReplaceState(
  onReplaceState: WindowHistoryFn
): WindowHistoryFn{
  const original: WindowHistoryFn = window.history.replaceState;

  window.history.replaceState = function(
    data: any, title: string, url?: (string | null)
  ): void{
    console.log("patchreplace");
    original.apply(this, [data, title, url]);
    onReplaceState(data, title, url);
  };
  
  return original;
}



