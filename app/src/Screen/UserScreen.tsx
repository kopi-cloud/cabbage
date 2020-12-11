import {NavTransition} from "Navigation/NavigationProvider";
import {SmallScreenContainer} from "Component/Screen";
import Typography from "@material-ui/core/Typography";
import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState
} from "react";
import {TextSpan} from "Component/TextSpan";
import {CurrentUser} from "Component/CurrentUser";
import {delay, stopClick} from "Util/EventUtil";
import TextField from "@material-ui/core/TextField/TextField";
import {ButtonContainer} from "Component/ButtonContainer";
import {PrimaryButton, SecondaryButton} from "Component/CabbageButton";
import SupabaseClient from "@supabase/supabase-js/dist/main/SupabaseClient";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {definitions} from "Generated/cabbage-sb-types";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";
import {useIsMounted} from "Util/ReactUtil";
import {CircularProgress, IconButton, InputAdornment} from "@material-ui/core";
import {Save, Sync, Undo, Visibility, VisibilityOff} from "@material-ui/icons";

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
  return <>
    <Typography paragraph variant={"h5"} style={{textAlign: "center"}}>
      User details
    </Typography>
    <CurrentUser/>
    <UserDetailsForm/>
    <TextSpan/>
  </>
}

function UserDetailsForm(){
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading" | "updating");
  const [loadedDisplayName, setLoadedDisplayName] =
    useState(undefined as undefined | string);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] =
    useState(undefined as undefined | ErrorInfo);
  const {db} = useAuthnUser();
  const isMounted = useIsMounted();

  const loadName = React.useCallback(async ()=>{
    setCurrentAction("reading");
    setDisplayNameError(undefined);
    const result = await loadDisplayName(db);
    await delay(1000, "show spinner delay");
    if( isErrorInfo(result) ){
      setDisplayNameError(result);
    }
    else {
      setLoadedDisplayName(result);
      setDisplayName(result);
    }
    setCurrentAction(undefined);
    if( isMounted.current ){
      setCurrentAction(undefined);
    }
  }, [db, isMounted]);

  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    loadName();
  }, [loadName]);

  function onSubmit(e: SyntheticEvent){
    stopClick(e);
  }

  function onDisplayNameChange(e: ChangeEvent<HTMLInputElement>){
    stopClick(e);
    setDisplayName(e.currentTarget.value as string);
  }

  const isDisplayNameEdited = loadedDisplayName !== displayName;
  return <>
    <form noValidate autoComplete="off"
      onSubmit={onSubmit}
    >
      <TextField id="displayNameInputField" label="Display name"
        value={displayName}
        onChange={onDisplayNameChange}
        disabled={!!currentAction}
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth={true}
        helperText={<TextSpan>
          {displayNameError?.message ?? "display name is shown publicly"}
        </TextSpan>}
        inputProps={{autoCapitalize: "none"}}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton onClick={()=>{
              if( isDisplayNameEdited ){
                setDisplayName(loadedDisplayName ?? "");
              }
              else {
                // noinspection JSIgnoredPromiseFromCall
                loadName();
              }
            }}>
              <Undo/>
            </IconButton>
            <IconButton disabled={!!currentAction || !isDisplayNameEdited}
              onClick={()=>{
                setDisplayNameError({
                  message: "save doesn't work yet",
                  problem: "work in progress" });
              }}
            >
              { currentAction === "reading" ?
                <CircularProgress size={"1em"}/> : <Save/>
              }
            </IconButton>
          </InputAdornment>
        }}

      />
    </form>
  </>
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

