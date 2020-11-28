import {SmallScreenContainer} from "Component/Screen";
import {Typography} from "@material-ui/core";
import {
  cabbageGithubUrl,
  netlifyUrl,
  NewWindowLink,
  supabaseUrl
} from "Component/ExternalLinks";
import {TextSpan} from "Component/TextSpan";
import React from "react";
import {PrimaryButton} from "Component/CabbageButton";
import Popover from "@material-ui/core/Popover";
import {Config} from "Config";
import {useSupabase} from "Api/SupabaseProvider";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";

const log = console;

export function WelcomeScreen(){
  return <>
    <IntroContainer/>
    <CabbageCountContainer/>
    <LoginContainer/>
  </>
}

function LoginContainer(){
  const [anchorEl, setAnchorEl] = React.useState(null as
    null | HTMLButtonElement);

  function onClick(event: React.MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget);
  }

  function onClose(){
    setAnchorEl(null);
  }

  const isOpen = Boolean(anchorEl);

  return <SmallScreenContainer center>
    <PrimaryButton onClick={onClick}>Log in to Cabbage</PrimaryButton>
    <Popover open={isOpen} anchorEl={anchorEl} onClose={onClose}>
      <TextSpan>Sorry, not yet implemented.</TextSpan>
    </Popover>
  </SmallScreenContainer>
}

function IntroContainer(){
  return <SmallScreenContainer center>
    <Typography paragraph>Cabbage is a simple demo app
      for <NewWindowLink href={supabaseUrl}>Supabase</NewWindowLink>.
    </Typography>
    <Typography paragraph>The Cabbage app is published
      via <NewWindowLink href={netlifyUrl}>Netlify</NewWindowLink>.
    </Typography>
    <Typography>You can find the source code for Cabbage over
      on <NewWindowLink href={cabbageGithubUrl}>Gihub</NewWindowLink>.
      <br/>
      This app was published from the `{Config.environmentName}` branch.
    </Typography>
  </SmallScreenContainer>
}

function CabbageCountContainer(){
  const {db} = useSupabase();
  const [cabbageCount, setCabbageCount] = React.useState("loading" as
    "loading" | number | ErrorInfo);
  const [incrementError, setIncrementError] = React.useState(undefined as
    undefined | ErrorInfo);

  const getCount = React.useCallback( async ()=>{
    const count = await getWelcomeCount(db);
    setCabbageCount( count );
    if( !isErrorInfo(count) ){
      const incResult = await incrementWelcomeCount(db, count+1);
      if( isErrorInfo(incResult) ){
        setIncrementError(incResult);
      }
    }
  }, [db]);

  React.useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    getCount();
  }, [getCount]);

  if( isErrorInfo(cabbageCount) ){
    return <SmallScreenContainer center>
      <CompactErrorPanel error={cabbageCount}/>
    </SmallScreenContainer>
  }

  return <SmallScreenContainer center>
    <Typography paragraph>
      <span>Anonymous cabbages served:</span>
      &emsp;
      <span style={{
        // stop it from jumping around between the loading and value
        display: 'inline-block', minWidth: '5em', textAlign: 'left'
      }}>
        {cabbageCount}
      </span>
    </Typography>
    <CompactErrorPanel error={incrementError}/>
  </SmallScreenContainer>
}

async function getWelcomeCount(db: SupabaseClient)
:Promise<number|ErrorInfo>{
  const { data, error } = await db.from('welcome').
    select(`value`).eq('id', 'visit_count');
  if( error ){
    return {
      message: "while getting the cabbage count",
      problem: error };
  }

  if( !data || !data[0] ||
    // watch out for "0" value :/
    data[0].value === undefined || data[0].value === null
  ){
    return {
      message: "unexpected data shape returned",
      problem: data };
  }

  return data[0].value as number;
}

async function incrementWelcomeCount(db: SupabaseClient, newCount: number)
: Promise<true|ErrorInfo>{
  const {data, error} =
    await db.from("welcome").update({value: newCount}).eq('id', 'visit_count');
  if( error ){
    return {message: "while setting welcome count", problem: error}
  }
  return true;
}