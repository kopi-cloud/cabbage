import {NavTransition, useNavigation} from "Navigation/NavigationProvider";
import {LargeScreenContainer} from "Component/Screen";
import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {queryPublicUserInfo} from "Api/CabbageApi";
import {public_user_info} from "Api/CabbageSchema";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {useIsMounted} from "Util/ReactUtil";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles
} from "@material-ui/core";
import {TextSpan} from "Component/TextSpan";
import {ContainerCard} from "Component/ContainerCard";
import {stopClick} from "Util/EventUtil";
import {RefreshIconButton} from "Component/RefreshIconButton";
import {getUserDisplayScreenLink} from "Screen/User/UserDisplayScreen";

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
    <LargeScreenContainer>
      <Content/>
    </LargeScreenContainer>
  </NavTransition>
}

function Content(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <UserListTable />
  </div>
}

const AllCols = 10;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function UserListTable(){
  const {db} = useSupabase();
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading");
  const [users, setUsers] =
    useState(undefined as undefined | public_user_info[]);
  const [readError, setReadError] =
    useState(undefined as undefined | ErrorInfo);
  const isMounted = useIsMounted();

  const readUsers = useCallback(async (event?: SyntheticEvent)=>{
    stopClick(event);
    setCurrentAction("reading")
    const result = await queryPublicUserInfo(db);
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
        <TableCell><strong>UUID</strong></TableCell>
        <TableCell><strong>Display name</strong></TableCell>
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
        <StyledTableRow key={row.uuid} >
          <StyledTableCell>
            <Link href={getUserDisplayScreenLink(row.uuid)}>{row.uuid}</Link>
          </StyledTableCell>
          <StyledTableCell>{row.display_name}</StyledTableCell>
        </StyledTableRow>
      ))}
      </TableBody>
    </Table></TableContainer>
  </ContainerCard>
}

export function Link({href, children}: {
  href: string,
  children: React.ReactNode,
}){
  const nav = useNavigation();

  return <a href={href}
    onClick={event=>nav.navigateTo(href, event)}
  >{children}</a>
}