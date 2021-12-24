import * as React from "react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {SmallScreenSpinner} from "Component/SmallScreenSpinner";
import {Config} from "Config";
import {createClient} from "@supabase/supabase-js";
import {TextSpan} from "Component/TextSpan";
import {SmallContentMain} from "Design/LayoutMain";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {
  AuthChangeEvent,
  Session,
  User
} from '@supabase/gotrue-js/dist/main/lib/types';
import {STORAGE_KEY} from '@supabase/gotrue-js/dist/main/lib/constants';
import {getUserEditScreenLink} from "Screen/User/UserEditScreen";
import {captureException, setUserId} from "Util/SendEventUtil";

const log = console;

export interface SupabaseApi {
  db: SupabaseClient,
  session: null | Session,
  user: null | User,
}

// use() call will return this if you forgot to add a provider
export const SupabaseApiContext: React.Context<SupabaseApi> =
  createContext({db: "no SupabaseProvider"} as unknown as SupabaseApi);

export const useSupabase = ()=> useContext(SupabaseApiContext);

/** send the user to the user screen if no path specified, don't want to use
 * navTo because this is called from a useEffect and we'd have to add the
 * nav to the useEffect inputs, which will cause this effect to re-run
 * (and re-build the SB client).
 * React knows about the change because useLocation() hook is watching
 * push/replaceState, which will force a re-render.
 */
export function redirectAfterSignIn(){
  let path = window.location.pathname;
  log.debug("redirectAfterSignIn()", path);
  if( !path || path === "" || path === "/" ){
    /* OAuth redirect target previously didn't include the path, now
    that it does, only redirect to the user screen if no path specified. */
    window.history.replaceState({}, "", getUserEditScreenLink());
  }
}

export function SupabaseProvider({children}: {children: ReactNode}){
  const [apiState, setApiState] = useState(undefined as undefined|SupabaseApi);
  const [isAnonKeyValid, setIsAnonKeyValid] = useState(true);
  const isOauthRedirect = useRef(false);
  const [isAutoSignIn, setIsAutoSignIn] = useState(false);

  /* IMPROVE: too verbose both in terms of code and logging.
   Most conditionals can probably be collapsed if the logging is removed,
   especially with the state now squished down into apiState. */
  useEffect(()=>{
    if( !Config.supabaseAnonKey ){
      log.error("supabaseAnonKey is not set, this is a built problem");
      setIsAnonKeyValid(false);
      return;
    }

    function onAuthStateChange(
      authEvent: AuthChangeEvent,
      session : Session | null
    ){
      log.debug("supabase auth state change", {
        authEvent, session, user: session?.user });
      setIsAutoSignIn(false);
      if( authEvent === "SIGNED_IN" ){
        if( isOauthRedirect.current ){
          log.debug("session restored from oauth redirect", {session: !!session});
          isOauthRedirect.current = false;
        }
        else {
          redirectAfterSignIn();
        }
      }
      setApiState((apiState)=>{
        /* this shouldn't happen any more because we do the setApiState() call
        in the intial render(), instead of in the setTime() handler hack. */
        if( !apiState ){
          console.log("change event with no apiState", authEvent, session);
          return;
        }
        return {db: apiState.db, session: session, user: session?.user ?? null}
      });
    }

    const newClient = createClient(Config.supabaseUrl, Config.supabaseAnonKey)
    log.debug("subabase client created");

    if( window.location.hash.indexOf('access_token') >= 0 ){
      log.debug("detected oauth redirect", window.location.pathname);
      isOauthRedirect.current = true;
      redirectAfterSignIn();
    }

    const subscription = newClient.auth.onAuthStateChange(onAuthStateChange);
    function cleanup(){
      subscription.data?.unsubscribe();
    }

    if( newClient.auth.session() ){
      // don't think I've seen this happen
      log.debug("SupabaseClient already has session");
      setApiState({
        db: newClient,
        session: newClient.auth.session(),
        user: newClient.auth?.session()?.user ?? null });
      return cleanup;
    }

    if( localStorage.getItem(STORAGE_KEY) ){
      if( newClient.auth.session() ){
        // never seen this
        log.debug("supabase token found, user has session");
      }
      else {
        log.debug("supabase token found and no session, wait for autoSignIn");
        setIsAutoSignIn(true);
        setTimeout(()=>{
          setIsAutoSignIn((currentVal)=>{
            if( currentVal ){
              log.debug("autoSignIn timed out");
              captureException("autoSignIn timed out", "");
            }
            return false
          });
        }, 3000);
      }
    }
    else {
      /* user never logged in, deleted localstorage, previously logged out,
      or we're landing a redirect for google SSO */
      log.debug("no supabase token found in localstorage");
    }

    /* this is where we used to do the setTimeout() hack, but SB appears to
    be fixed now, see:
    https://github.com/supabase/supabase/discussions/318
    https://github.com/supabase/gotrue-js/blob/f21a620dc3719b7d34aa1bb3ccb5cdb0b1e8c1d9/src/GoTrueClient.ts#L57
    https://stackoverflow.com/a/14529748/924597
    */
    log.debug("set apiState");
    setApiState({
      db: newClient,
      session: newClient.auth.session(),
      user: newClient.auth?.session()?.user ?? null });

    return cleanup;
  }, []);

  if( !isAnonKeyValid ){
    /* Usually seen when you forget to add env variables like
     REACT_APP_CABBAGE_ENV, etc. */
    return <SmallContentMain><TextSpan>
      There's a problem with the build - the Supabase anon key is not valid.
    </TextSpan></SmallContentMain>
  }

  if( !apiState ){
    log.debug("showing spinner while creating supabase apiState");
    return <SmallScreenSpinner message={"Configuring Supabase API"}/>
  }

  if( isOauthRedirect.current ){
    log.debug("showing spinner while waiting for oauth login");
    return <SmallScreenSpinner message={"Processing SSO identity"}/>
  }

  if( isAutoSignIn && !apiState.session){
    log.debug("showing spinner while waiting for autoSignIn");
    return <SmallScreenSpinner message={"Automatic sign-in"}/>
  }
  
  setUserId(apiState.user?.id ?? "anonymous");

  return <SupabaseApiContext.Provider value={apiState}>
    {children}
  </SupabaseApiContext.Provider>
}

