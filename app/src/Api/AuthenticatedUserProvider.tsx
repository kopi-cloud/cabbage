import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {Session, User} from "@supabase/gotrue-js/dist/main/lib/types";
import * as React from "react";
import {createContext, ReactNode, useContext} from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {SignInContainer} from "Screen/Welcome/SigninContainer";
import {getUserEditScreenLink} from "Screen/User/UserEditScreen";
import {CabbageCountContainer} from "Screen/Welcome/CabbageCountContainer";
import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {
  cabbageGithubUrl,
  netlifyUrl,
  NewWindowLink,
  supabaseUrl
} from "Component/ExternalLinks";
import {Config} from "Config";

const log = console;

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

/** The AuthnProvider allows consumers to not have to deal with the "what if the
 * user is not signed in" scenario - note user/session is not-null/undefined in
 * the interface returned by useAuthnUser().
 */
export function AuthenticatedUserProvider({children}: {children: ReactNode}){
  const supabase = useSupabase();

  if( !supabase.session || !supabase.user ){
    log.debug("unauthenticated render")
    return <>
      <IntroContainer/>
      <SignInContainer signInRedirect={getUserEditScreenLink()} />
      <CabbageCountContainer/>
    </>
  }

  return <AuthenticatedUserContext.Provider value={{
    db: supabase.db,
    session: supabase.session,
    user: supabase.user,
  }}>
    {children}
  </AuthenticatedUserContext.Provider>
}

function IntroContainer(){
  return <SmallScreenContainer center>
    <Typography paragraph>Cabbage is a <del>simple</del> demo app
      for <NewWindowLink href={supabaseUrl}>Supabase</NewWindowLink>.
    </Typography>
    <Typography paragraph>The Cabbage app is published
      via <NewWindowLink href={netlifyUrl}>Netlify</NewWindowLink>.
    </Typography>
    <Typography>You can find the source code for Cabbage over
      on <NewWindowLink href={cabbageGithubUrl}>Github</NewWindowLink>.
      <br/>
      This app was published from the `{Config.environmentName}` branch
      ({Config.gitCommit.substr(0, 8).trim()}).
    </Typography>
  </SmallScreenContainer>
}

