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
import {SmallScreenContainer} from "Component/Screen";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {
  AuthChangeEvent,
  Session,
  User
} from '@supabase/gotrue-js/dist/main/lib/types';
import {STORAGE_KEY} from '@supabase/gotrue-js/dist/main/lib/constants';
import {getUserScreenLink} from "Screen/UserScreen";
import {useNavigation} from "Navigation/NavigationProvider";

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

export function SupabaseProvider({children}: {children: ReactNode}){
  const [apiState, setApiState] = useState(undefined as undefined|SupabaseApi);
  const [isAnonKeyValid, setIsAnonKeyValid] = useState(true);
  const isOauthRedirect = useRef(false);

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
      if( authEvent === "SIGNED_IN" && isOauthRedirect.current ){
        log.debug("session restored from oauth redirect", {session: !!session});
        isOauthRedirect.current = false;
        /* force the user to the user screen, don't want to use navTo because
         then we need to add it to the useEffect inputs, which will cause this
         effect to re-run (and re-build the SB client). */
        window.location.pathname = getUserScreenLink();
      }
      setApiState((apiState)=>{
        if( !apiState ) throw new Error("change event with no apiState");
        return {db: apiState.db, session: session, user: session?.user ?? null}
      });
    }

    const newClient = createClient(Config.supabaseUrl, Config.supabaseAnonKey)
    log.debug("subabase client created");

    if( window.location.hash.indexOf('access_token') >= 0 ){
      log.debug("detected this is an oauth redirect");
      isOauthRedirect.current = true;
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

    if( !localStorage.getItem(STORAGE_KEY) ){
      /* user never logged in, deleted localstorage, previously logged out,
      or we're being landing a redirect for google SSO */
      log.debug("X no supabase token found in localstorage");
    }

    /* session restore is async, see:
     https://github.com/supabase/supabase/discussions/318
     https://github.com/supabase/gotrue-js/blob/f21a620dc3719b7d34aa1bb3ccb5cdb0b1e8c1d9/src/GoTrueClient.ts#L57
     https://stackoverflow.com/a/14529748/924597
     As per linked gotrue code, the timeout() for doing the session restore has
     already been scheduled when createClient() returns.  As per the SO answer
     linked, our timeout() call should be guaranteed to run /after/ the gotrue
     timeout. See /doc/example/sb-auth-restore for an example. */
    log.debug("waiting for supabase to restore session from localstorage");
    setTimeout(()=>{
      if( newClient.auth.session() ){
        log.debug("supabase session restored");
        setApiState({
          db: newClient,
          session: newClient.auth.session(),
          user: newClient.auth?.session()?.user ?? null });
      }
      else {
        /* likely because session token exists, but was expired - in which case
        gotrue deletes the token and does not restore the session. */
        log.debug("no supabase session was restored");
        setApiState({
          db: newClient,
          session: newClient.auth.session(),
          user: newClient.auth?.session()?.user ?? null });
      }
    });

    return cleanup;
  }, []);

  if( !isAnonKeyValid ){
    return <SmallScreenContainer><TextSpan>
      There's a problem with the build - the Supabase anon key is not valid.
    </TextSpan></SmallScreenContainer>
  }

  if( !apiState ){
    log.debug("showing spinner while creating supabase apiState");
    return <SmallScreenSpinner message={"Configuring Supabase API"}/>
  }

  if( isOauthRedirect.current ){
    log.debug("showing spinner while waiting for oauth login");
    return <SmallScreenSpinner message={"Processing SSO identity"}/>
  }

  return <SupabaseApiContext.Provider value={apiState}>
    {children}
  </SupabaseApiContext.Provider>
}

