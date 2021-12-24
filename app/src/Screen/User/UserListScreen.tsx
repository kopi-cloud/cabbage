import {NavTransition} from "Design/NavigationProvider";
import {LargeContentMain} from "Design/LayoutMain";
import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {queryListPublicUserInfo} from "Api/CabbageApi";
import {list_public_user_info, public_user_info} from "Api/CabbageSchema";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {useIsMounted} from "Util/ReactUtil";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import {TextSpan} from "Component/TextSpan";
import {ContainerCard} from "Design/ContainerCard";
import {stopClick} from "Util/EventUtil";
import {RefreshIconButton} from "Component/RefreshIconButton";
import {getUserDisplayScreenLink} from "Screen/User/UserDisplayScreen";
import {formatShortIsoDateTime, parseServerDate} from "Util/DateUtil";
import {Link} from "Component/Link";
import {AlternatingTableRow} from "Component/Util";

const log = console;

const screenUrl = "/users";

export function getUserListScreenLink(): string{
  return screenUrl;
}

export function isUserListScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(screenUrl);
}

export function UserListScreen(){
  return <NavTransition isPath={isUserListScreenPath}
    title={"Cabbage - users"}
  >
    <LargeContentMain>
      <Content/>
    </LargeContentMain>
  </NavTransition>
}

function Content(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <UserListTable />
  </div>
}

const AllCols = 10;

function UserListTable(){
  const {db} = useSupabase();
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading");
  const [users, setUsers] =
    useState(undefined as undefined | list_public_user_info[]);
  const [readError, setReadError] =
    useState(undefined as undefined | ErrorInfo);
  const isMounted = useIsMounted();

  const readUsers = useCallback(async (event?: SyntheticEvent)=>{
    stopClick(event);
    setCurrentAction("reading")
    const result = await queryListPublicUserInfo(db);
    if( !isMounted.current ) return;
    if( isErrorInfo(result) ){
      setReadError(result);
    }
    else {
      setUsers(result);
      setReadError(undefined);
    }
    setCurrentAction(undefined);
  }, [db, isMounted]);

  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    readUsers();
  }, [readUsers]);

  return <ContainerCard title={<TextSpan>Users</TextSpan>}
    action={<>
      <RefreshIconButton onClick={readUsers}
        refreshing={currentAction === "reading"} />
    </>}
  >
    <CompactErrorPanel error={readError}/>
    <TableContainer ><Table>
      <TableHead><TableRow>
        <TableCell><strong>Display name</strong></TableCell>
        <TableCell><strong>Created</strong></TableCell>
      </TableRow></TableHead>
      <TableBody>
      { users === undefined && currentAction === "reading" && <>
        <TableRow><TableCell colSpan={AllCols} align="center">
          <LinearProgress style={{height: 2}}/>
        </TableCell></TableRow>
      </> }
      { users !== undefined && users.length < 1 && <>
      <TableRow><TableCell colSpan={AllCols} align="center">
          <TextSpan>No rows returned</TextSpan>
      </TableCell></TableRow>
      </> }
      { users?.map((row) => (
        <AlternatingTableRow key={row.uuid}>
          <TableCell>
            <UserNameLink user={row}/>
          </TableCell>
          <TableCell>
            <UserCreatedText user={row}/>
          </TableCell>
        </AlternatingTableRow>
      ))}
      </TableBody>
    </Table></TableContainer>
  </ContainerCard>
}

export function UserNameLink({user}:{user: public_user_info}){
  return <Link href={getUserDisplayScreenLink(user.uuid)}
    variant="body1"
  >
    { user.display_name || "unspecified" }
  </Link>
}

export function UserCreatedText({user}:{user: list_public_user_info}){
  return <TextSpan>
    { !!user.created &&
      formatShortIsoDateTime(parseServerDate(user.created))  
    }
    { !user.created &&
      "user deleted"  
    }
  </TextSpan>
}