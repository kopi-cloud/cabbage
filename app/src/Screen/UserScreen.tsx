import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React, {useCallback} from "react";
import {TextSpan} from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {ErrorInfo} from "Error/ErrorUtil";
import {definitions} from "Generated/cabbage-sb-types";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";
import {HelpPopover} from "Component/HelpPopover";
import {SavingTextField} from "Component/SavingTextField";
import Divider from "@material-ui/core/Divider";

const log = console;

const userUrl = "/user";

export function getUserScreenLink(): string{
  return userUrl;
}

export function isUserScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(userUrl);
}

export function UserScreen(){
  return <NavTransition isPath={isUserScreenPath} title={"Cabbage - user home"}>
    <SmallScreenContainer>
      <UserContainer/>
    </SmallScreenContainer>
  </NavTransition>
}

function UserContainer(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <CurrentUser/>
    <UserDetailsForm/>
  </div>
}

function UserDetailsForm(){
  const {db} = useAuthnUser();
  const readDisplayName = useCallback(async ()=>{
    return loadDisplayName(db);
  }, [db]);

  const writeDisplayName = useCallback(async (value: string)=>{
    return {
      message: "save doesn't work yet",
      problem: `can't save value ${value}` };
  }, []);

  const readContactDetails = useCallback(async ()=>{
    return loadDisplayName(db);
  }, [db]);

  const writeContactDetails = useCallback(async (value: string)=>{
    return {
      message: "save doesn't work yet",
      problem: `can't save value ${value}` };
  }, []);

  return <div style={{display: "flex", flexDirection: "column"}}>

    <Divider style={{paddingTop: "2em"}}>Public details</Divider>
    <SavingTextField id="displayNameInputField" label="Display name"
      readValue={readDisplayName}
      writeValue={writeDisplayName}
      helperText={<TextSpan>
        <HelpPopover content={<TextSpan>
          This value is shown to other users to identify any content
          you post.
        </TextSpan>}/>
        Note: display name is publicly visible
      </TextSpan>}
    />

    <Divider style={{paddingTop: "2em"}}>Private details</Divider>
    <SavingTextField id="contactInputField" label="Contact details"
      readValue={readContactDetails}
      writeValue={writeContactDetails}
      helperText={<TextSpan>
        <HelpPopover content={<TextSpan>
          This value is never seen by other users.
        </TextSpan>}/>
        Note: Contact details are private
      </TextSpan>}
    />

  </div>
}


export async function loadDisplayName(db: SupabaseClient):Promise<string|ErrorInfo>{

  /*
   import {PostgrestResponse} from "@supabase/postgrest-js/dist/main/lib/types";
   Module '"../../node_modules/@supabase/postgrest-js/dist/main/lib/types"' declares 'PostgrestResponse' locally, but it is not exported.
   const row: PostgrestResponse<definitions["user_info"]> =
  */
  const row =
    await db.from<definitions["user_info"]>("user_info").select('display_name');
  log.debug("openapi row", {row});
  if( row.error ){
    return { problem: row.error,
      message: row.error.message ?? "problem while loading display name" };
  }
  if( row?.data === null || row?.data === undefined || row?.data.length < 1 ){
    return "";
  }
  const data: definitions["user_info"][] = row.data;
  return data[0].display_name ?? "";
}

