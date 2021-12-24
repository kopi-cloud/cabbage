import {NavTransition} from "Design/NavigationProvider";
import {SmallContentMain} from "Design/LayoutMain";
import Typography from "@mui/material/Typography";
import React, {useCallback} from "react";
import {TextSpan} from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";
import {IntroContainer, useAuthnUser} from "Api/AuthenticatedUserProvider";
import {HelpPopover} from "Component/HelpPopover";
import {SavingTextField} from "Component/SavingTextField";
import Divider from "@mui/material/Divider";
import {
  queryAbout,
  queryContactDetails,
  queryDisplayName,
  upsertAbout,
  upsertContactDetails,
  upsertDisplayName
} from "Api/CabbageApi";

const log = console;

const userUrl = "/user";

export function getUserEditScreenLink(): string{
  return userUrl;
}

export function isUserEditScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath === userUrl || normalizedPath === userUrl;
}

export function UserEditScreen(){
  return <NavTransition isPath={isUserEditScreenPath} title={"Cabbage - user home"}>
    <SmallContentMain>
      <UserContainer/>
    </SmallContentMain>
    <IntroContainer/>
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
    return queryDisplayName(db);
  }, [db]);

  const writeDisplayName = useCallback(async (value: string)=>{
    return await upsertDisplayName(db, value);
  }, [db]);

  const readAbout = useCallback(async ()=>{
    return queryAbout(db);
  }, [db]);

  const writeAbout = useCallback(async (value: string)=>{
    return await upsertAbout(db, value);
  }, [db]);

  const readContactDetails = useCallback(async ()=>{
    return queryContactDetails(db);
  }, [db]);

  const writeContactDetails = useCallback(async (value: string)=>{
    return await upsertContactDetails(db, value);
  }, [db]);

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
        Note: publicly visible
      </TextSpan>}
    />

    <SavingTextField id="aboutInputField" label="About you"
      readValue={readAbout}
      writeValue={writeAbout}
      helperText={<TextSpan>
        <HelpPopover content={<TextSpan>
          This value is shown to other users if they want to know more about 
          you.
        </TextSpan>}/>
        Note: publicly visible
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
        Note: only visible to yourself and admin staff.
      </TextSpan>}
    />

  </div>
}


