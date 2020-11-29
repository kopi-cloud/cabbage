import * as React from "react";
import {useContext} from "react";
import {SmallScreenSpinner} from "Component/SmallScreenSpinner";
import {Config} from "Config";
import {createClient} from "@supabase/supabase-js";
import { TextSpan } from "Component/TextSpan";
import {SmallScreenContainer} from "Component/Screen";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import { Session } from '@supabase/gotrue-js/dist/main/lib/types';

const log = console;

export interface SupabaseApi {
  db: SupabaseClient,
  session: null | Session,
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
  const [isAnonKeyValid, setIsAnonKeyValid] = React.useState(true);

  React.useEffect(()=>{
    if( !Config.supabaseAnonKey ){
      setIsAnonKeyValid(false);
      return;
    }
    const client = createClient(Config.supabaseUrl, Config.supabaseAnonKey)
    client.auth.onAuthStateChange((authEvent, session)=>{
      log.debug("supabase auth state change", {authEvent, session});
      setSupabaseSession(session);
    })
    log.debug("subabase client created");
    setSupabaseClient(client);
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
  }}>
    {children}
  </SupabaseApiContext.Provider>
}

