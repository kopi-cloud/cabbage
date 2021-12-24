import {NavTransition} from "Design/NavigationProvider";
import {LargeContentMain} from "Design/LayoutMain";
import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import {useSupabase} from "Api/SupabaseProvider";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {queryFlywaySchemaHistory} from "Api/CabbageApi";
import {flyway_schema_history} from "Api/CabbageSchema";
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
import {formatShortIsoDateTime, parseServerDate} from "Util/DateUtil";
import {ContainerCard} from "Design/ContainerCard";
import {stopClick} from "Util/EventUtil";
import {RefreshIconButton} from "Component/RefreshIconButton";
import {Check, Warning} from "@mui/icons-material";
import {AlternatingTableRow} from "Component/Util";

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
    <LargeContentMain>
      <Content/>
    </LargeContentMain>
  </NavTransition>
}

function Content(){
  return <div style={{display: "flex", flexDirection: "column"}}>
    <SchemaHistoryTable />
  </div>
}

const AllCols = 10;

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
        <AlternatingTableRow key={row.installed_rank} >
          <TableCell component="th" scope="row" align="right">
            {row.version}
          </TableCell>
          <TableCell>{row.description}</TableCell>
          <TableCell>{
            formatShortIsoDateTime(parseServerDate(row.installed_on))
          }</TableCell>
          <TableCell align="center">
            { row.success ?
              <Check htmlColor={"green"}/> : <Warning htmlColor={"red"}/>
            }
          </TableCell>
        </AlternatingTableRow>
      ))}
      </TableBody>
    </Table></TableContainer>
  </ContainerCard>
}
