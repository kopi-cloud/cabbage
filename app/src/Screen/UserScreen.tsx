import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React, {useCallback} from "react";
import {TextSpan} from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";
import {HelpPopover} from "Component/HelpPopover";
import {SavingTextField} from "Component/SavingTextField";
import Divider from "@material-ui/core/Divider";
import {queryContactDetails, queryDisplayName, upsertContactDetails, upsertDisplayName} from "Api/CabbageApi";

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
    return queryDisplayName(db);
  }, [db]);

  const writeDisplayName = useCallback(async (value: string)=>{
    return await upsertDisplayName(db, value);
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


