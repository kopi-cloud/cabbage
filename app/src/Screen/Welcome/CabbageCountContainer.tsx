import {useSupabase} from "Api/SupabaseProvider";
import React from "react";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {SmallScreenContainer} from "Component/Screen";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {Typography} from "@material-ui/core";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {useIsMounted} from "Util/ReactUtil";

export function CabbageCountContainer(){
  const {db} = useSupabase();
  const isMounted = useIsMounted();
  const [cabbageCount, setCabbageCount] = React.useState("loading" as
    "loading" | number | ErrorInfo);
  const [incrementError, setIncrementError] = React.useState(undefined as
    undefined | ErrorInfo);

  const getCount = React.useCallback( async ()=>{
    const count = await getWelcomeCount(db);
    /*avoid error from setting unmounted state, caused byimmediately redirecting
     away to the /user screen after a SSO login. */
    if(!isMounted.current) return;
    setCabbageCount( count );
    if( !isErrorInfo(count) ){
      const incResult = await incrementWelcomeCount(db, count+1);
      if( isErrorInfo(incResult) ){
        setIncrementError(incResult);
      }
    }
  }, [db, isMounted]);

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