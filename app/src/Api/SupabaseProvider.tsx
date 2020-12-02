import * as React from "react";
import {useContext} from "react";
import {SmallScreenSpinner} from "Component/SmallScreenSpinner";
import {Config} from "Config";
import {createClient} from "@supabase/supabase-js";
import { TextSpan } from "Component/TextSpan";
import {SmallScreenContainer} from "Component/Screen";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {
  AuthChangeEvent,
  Session,
  User
} from '@supabase/gotrue-js/dist/main/lib/types';
import { STORAGE_KEY } from '@supabase/gotrue-js/dist/main/lib/constants';

const log = console;

export interface SupabaseApi {
  db: SupabaseClient,
  session: null | Session,
  user: null | User,
}

// use() call will return this if you forgot to add a provider
export const SupabaseApiContext: React.Context<SupabaseApi> =
  React.createContext({db: "no SupabaseProvider"} as unknown as SupabaseApi);

export const useSupabase = ()=> useContext(SupabaseApiContext);

export function SupabaseProvider({children}: {children: React.ReactNode}){
  const [supabaseClient, setSupabaseClient] = React.useState(undefined as
    undefined|SupabaseClient );
  const [subabaseSession, setSupabaseSession] = React.useState(null as
    null|Session );
  const [subabaseUser, setSupabaseUser] = React.useState(null as
    null|User );
  const [isAnonKeyValid, setIsAnonKeyValid] = React.useState(true);

  /* IMPROVE: implementation is too verbose both in terms of code and logging.
   The conditionals can probably be collapsed if the logging is removed. */
  React.useEffect(()=>{
    if( !Config.supabaseAnonKey ){
      log.error("supabaseAnonKey is not set, this is a built problem");
      setIsAnonKeyValid(false);
      return;
    }

    function onAuthStateChange(
      authEvent: AuthChangeEvent | "session-restored",
      session : Session | null
    ){
      log.debug("supabase auth state change", {
        authEvent, session, user: session?.user });
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null)
    }

    const newClient = createClient(Config.supabaseUrl, Config.supabaseAnonKey)
    const subscription = newClient.auth.onAuthStateChange(onAuthStateChange);
    function unsubscribe(){
      subscription.data?.unsubscribe();
    }
    log.debug("subabase client created");

    if( newClient.auth.session() ){
      log.debug("SupabaseClient already has session");
      setSupabaseClient(newClient);
      setSupabaseSession(newClient.auth.session());
      setSupabaseUser(newClient.auth.session()?.user ?? null)
      return unsubscribe;
    }

    if( !localStorage.getItem(STORAGE_KEY) ){
      log.debug("no supabase token found in localstorage");
      setSupabaseClient(newClient);
      setSupabaseSession(newClient.auth.session());
      setSupabaseUser(newClient.auth.session()?.user ?? null)
      return unsubscribe;
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
        onAuthStateChange("session-restored", newClient.auth.session());
      }
      else {
        // shouldn't happen, if you see this - maybe something in SB changed?
        log.debug("no supabase session was restored");
      }
      /* important to set client /after/ firing change so that children will
      not be rendered with no session/user set
      (user will just continue seeing the "!supabaseClient spinner") */
      setSupabaseClient(newClient);
    });

    return unsubscribe;
  }, []);

  if( !isAnonKeyValid ){
    return <SmallScreenContainer><TextSpan>
      There's a problem with the build - the Supabase anon key is not valid.
    </TextSpan></SmallScreenContainer>
  }

  if( !supabaseClient ){
    log.debug("showing spinner while creating supabase client");
    return <SmallScreenSpinner message={"Configuring Supabase API"}/>
  }

  return <SupabaseApiContext.Provider value={{
    db: supabaseClient,
    session: subabaseSession,
    user: subabaseUser,
  }}>
    {children}
  </SupabaseApiContext.Provider>
}

