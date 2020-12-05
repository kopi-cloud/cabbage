import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {Session, User} from "@supabase/gotrue-js/dist/main/lib/types";
import * as React from "react";
import {createContext, ReactNode, useContext} from "react";
import {SignInContainer} from "Screen/Welcome/SigninContainer";
import {useSupabase} from "Api/SupabaseProvider";

export interface AuthenticatedUser {
  db: SupabaseClient,
  session: Session,
  user: User,
}

// use() call will return this if you forgot to add a provider
export const AuthenticatedUserContext: React.Context<AuthenticatedUser> =
  createContext({db: "no AuthenticatedUserProvider"} as
    unknown as AuthenticatedUser );

export const useAuthnUser = ()=> useContext(AuthenticatedUserContext);

/** The AuthnProvider is t consumers not having to deal with the "what if the
 * user is not signed in" scenario - note user/session is not-null/undefined in
 * the interface returned by useAuthnUser().
 */
export function AuthenticatedUserProvider({children}: {children: ReactNode}){
  const supabase = useSupabase();

  if( !supabase.session || !supabase.user ){
    // leave the browser location alone, user will see the sign-in container
    // but as soon as they signin, they see the screen for the url
    return <SignInContainer/>
  }

  return <AuthenticatedUserContext.Provider value={{
    db: supabase.db,
    session: supabase.session,
    user: supabase.user,
  }}>
    {children}
  </AuthenticatedUserContext.Provider>
}

