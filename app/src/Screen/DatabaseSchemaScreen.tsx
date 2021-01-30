import {NavTransition} from "Navigation/NavigationProvider";
import {LargeScreenContainer} from "Component/Screen";
import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {queryFlywaySchemaHistory} from "Api/CabbageApi";
import {flyway_schema_history} from "Api/CabbageSchema";
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
import {formatShortIsoDateTime, parseServerDate} from "Util/DateUtil";
import {ContainerCard} from "Component/ContainerCard";
import {stopClick} from "Util/EventUtil";
import {RefreshIconButton} from "Component/RefreshIconButton";
import {Check, Warning} from "@material-ui/icons";

const log = console;

const screenUrl = "/database-schema";

export function getDbSchemaScreenLink(): string{
  return screenUrl;
}

export function isDbSchemaScreenPath(path: String): boolean{
  const normalizedPath = path.toLowerCase();
  return normalizedPath.startsWith(screenUrl);
}

export function DatabaseSchemaScreen(){
  return <NavTransition isPath={isDbSchemaScreenPath}
    title={"Cabbage - database schema"}
  >
    <LargeScreenContainer>
      <Content/>
    </LargeScreenContainer>
  </NavTransition>
}

function Content(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <SchemaHistoryTable />
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

function SchemaHistoryTable(){
  const {db} = useSupabase();
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading" | "updating");
  const [history, setHistory] =
    useState(undefined as undefined | flyway_schema_history[]);
  const [readError, setReadError] =
    useState(undefined as undefined | ErrorInfo);
  const isMounted = useIsMounted();

  const readHistory = useCallback(async (event?: SyntheticEvent)=>{
    stopClick(event);
    setCurrentAction("reading")
    const result = await queryFlywaySchemaHistory(db);
    if( !isMounted.current ) return;
    if( isErrorInfo(result) ){
      setReadError(result);
    }
    else {
      setHistory(result);
      setReadError(undefined);
    }
    setCurrentAction(undefined);
  }, [db, isMounted]);

  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    readHistory();
  }, [readHistory]);

  return <ContainerCard title={<TextSpan>Database schema history</TextSpan>}
    action={<>
      <RefreshIconButton onClick={readHistory}
        refreshing={currentAction === "reading"} />
    </>}
  >
    <CompactErrorPanel error={readError}/>
    <TableContainer ><Table>
      <TableHead><TableRow>
        <TableCell align="right"><strong>Version</strong></TableCell>
        <TableCell><strong>Description</strong></TableCell>
        <TableCell><strong>Installed</strong></TableCell>
        <TableCell align="center"><strong>Success</strong></TableCell>
      </TableRow></TableHead>
      <TableBody>
      { history === undefined && currentAction === "reading" && <>
        <TableRow><TableCell colSpan={AllCols} align="center">
          <LinearProgress style={{height: 2}}/>
        </TableCell></TableRow>
      </> }
      { history !== undefined && history.length < 1 && <>
      <TableRow><TableCell colSpan={AllCols} align="center">
          <TextSpan>No rows returned</TextSpan>
      </TableCell></TableRow>
      </> }
      { history?.map((row) => (
        <StyledTableRow key={row.installed_rank} >
          <StyledTableCell component="th" scope="row" align="right">
            {row.version}
          </StyledTableCell>
          <StyledTableCell>{row.description}</StyledTableCell>
          <StyledTableCell>{
            formatShortIsoDateTime(parseServerDate(row.installed_on))
          }</StyledTableCell>
          <StyledTableCell align="center">
            { row.success ?
              <Check htmlColor={"green"}/> : <Warning htmlColor={"red"}/>
            }
          </StyledTableCell>
        </StyledTableRow>
      ))}
      </TableBody>
    </Table></TableContainer>
  </ContainerCard>
}
