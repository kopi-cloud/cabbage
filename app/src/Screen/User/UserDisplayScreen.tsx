import {NavTransition, useNavigation} from "Design/NavigationProvider";
import {SmallContentMain} from "Design/LayoutMain";
import Typography from "@mui/material/Typography";
import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {TextSpan} from "Component/TextSpan";
import Divider from "@mui/material/Divider";
import {useSupabase} from "Api/SupabaseProvider";
import {public_user_info} from "Api/CabbageSchema";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {useIsMounted} from "Util/ReactUtil";
import {stopClick} from "Util/EventUtil";
import {queryReadPublicUserInfo} from "Api/CabbageApi";
import {CompactErrorPanel} from "Error/CompactErrorPanel";

const log = console;

const screenUrl = "/user/";

export function getUserDisplayScreenLink(uuid: string): string{
  return screenUrl + uuid;
}

export function isUserDisplayScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(screenUrl);
}

export function getUserIdFromPath(path: string): string | undefined{
  return path.match(`${screenUrl}(.*)`)?.[1];
}

export function UserDisplayScreen(){
  return <NavTransition isPath={isUserDisplayScreenPath} title={"Cabbage - user display"}>
    <SmallContentMain>
      <UserDisplayContainer/>
    </SmallContentMain>
  </NavTransition>
}

function UserDisplayContainer(){
  const nav = useNavigation();

  const uuid = getUserIdFromPath(nav.pathname);
  if( !uuid ){
    return <TextSpan>Unable to parse UUID from browser location bar</TextSpan>;
  }
  
  return <div style={{display: "flex", flexDirection: "column"}}>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <UserPublicInfo uuid={uuid}/>
  </div>
}

function UserPublicInfo({uuid}:{
  uuid: string
}){
  const {db} = useSupabase();
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading");
  const [publicInfo, setPublicInfo] =
    useState(undefined as undefined | public_user_info);
  const [readError, setReadError] =
    useState(undefined as undefined | ErrorInfo);
  const isMounted = useIsMounted();

  const readUsers = useCallback(async (event?: SyntheticEvent)=>{
    stopClick(event);
    setCurrentAction("reading")
    const result = await queryReadPublicUserInfo(db, uuid);
    if( !isMounted.current ) return;
    if( isErrorInfo(result) ){
      setReadError(result);
    }
    else {
      setPublicInfo(result);
      setReadError(undefined);
    }
    setCurrentAction(undefined);
  }, [db, isMounted, uuid]);

  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    readUsers();
  }, [readUsers]);
  
  
  return <>
    <TextSpan>
      UUID - {uuid}
    </TextSpan>
    <Divider style={{paddingTop: "2em"}}>Public details</Divider>
    <TextSpan>
      Display name:{' '}
      { publicInfo &&
        publicInfo.display_name
      }
    </TextSpan>
    <TextSpan>
      About:{' '}
      { publicInfo &&
        publicInfo.about
      }
    </TextSpan>
    <CompactErrorPanel error={readError}/>
  </>;
}

