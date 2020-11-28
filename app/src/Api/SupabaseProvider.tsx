import * as React from "react";
import {useContext} from "react";
import {SmallScreenSpinner} from "Component/SmallScreenSpinner";
import {Config} from "Config";
import {createClient} from "@supabase/supabase-js";
import { TextSpan } from "Component/TextSpan";
import {SmallScreenContainer} from "Component/Screen";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";

const log = console;

export interface SupabaseApi {
  db: SupabaseClient,
}

// use() call will return this if you forgot to add a provider
export const SupabaseApiContext: React.Context<SupabaseApi> =
  React.createContext({db: "no SupabaseProvider"} as unknown as SupabaseApi);

export const useSupabase = ()=> useContext(SupabaseApiContext);

export function SupabaseProvider({children}: {children: React.ReactNode}){
  const [supabaseApi, setSupabaseApi] = React.useState(
    undefined as undefined|SupabaseApi );
  const [isAnonKeyValid, setIsAnonKeyValid] = React.useState(true);

  React.useEffect(()=>{
    if( !Config.supabaseAnonKey ){
      setIsAnonKeyValid(false);
      return;
    }
    const db = createClient(Config.supabaseUrl, Config.supabaseAnonKey)
    log.debug("subabase client created");
    setSupabaseApi({db});
  }, []);

  if( !isAnonKeyValid ){
    return <SmallScreenContainer><TextSpan>
      There's a problem with the build - the Supabase anon key is not valid.
    </TextSpan></SmallScreenContainer>
  }

  if( !supabaseApi ){
    log.debug("showing spinner while creating supabase client");
    return <SmallScreenSpinner message={"Configuring Supabase API"}/>
  }

  return <SupabaseApiContext.Provider value={supabaseApi}>
    {children}
  </SupabaseApiContext.Provider>
}

