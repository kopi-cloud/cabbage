import React, {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState
} from "react";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {useIsMounted} from "Util/ReactUtil";
import {delay, stopClick} from "Util/EventUtil";
import TextField from "@mui/material/TextField/TextField";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextFieldProps
} from "@mui/material";
import {Save, Undo} from "@mui/icons-material";
import { HelpPopover } from "./HelpPopover";
import { TextSpan } from "./TextSpan";

type Props = {
  readValue: ()=>Promise<string|ErrorInfo>,
  writeValue: (value:string)=>Promise<string|ErrorInfo>,
} & TextFieldProps;

/**
 * Not sure what to call it, "SavableTextField"? "AtomicTextField"?
 */
export function SavingTextField({
  readValue,
  writeValue,
  helperText,
  ...textFieldProps
}: Props){
  const [currentAction, setCurrentAction] = useState("reading" as
    undefined | "reading" | "updating");
  const [loadedValue, setLoadedValue] =
    useState(undefined as undefined | string);
  const [value, setValue] = useState("");
  const [valueError, setValueError] =
    useState(undefined as undefined | ErrorInfo);
  const isMounted = useIsMounted();

  const loadValue = React.useCallback(async ()=>{
    setCurrentAction("reading");
    setValueError(undefined);
    const result = await readValue();
    if( !isMounted.current ){
      return;
    }
    if( isErrorInfo(result) ){
      setValueError(result);
    }
    else {
      setLoadedValue(result);
      setValue(result);
    }
    setCurrentAction(undefined);
  }, [readValue, isMounted]);

  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    loadValue();
  }, [loadValue]);

  async function onSubmit(e: SyntheticEvent){
    stopClick(e);
    setCurrentAction("updating");
    setValueError(undefined);
    const result = await writeValue(value);
    if( !isMounted.current ){
      return;
    }
    if( isErrorInfo(result) ){
      setValueError(result);
    }
    else {
      setLoadedValue(result);
      setValue(result);
    }
    setCurrentAction(undefined);
  }

  function onValueChange(e: ChangeEvent<HTMLInputElement>){
    stopClick(e);
    setValue(e.currentTarget.value as string);
  }

  const isValueEdited = loadedValue !== value;
  let helperTextContent = helperText;
  if( valueError ){
    helperTextContent = <span style={{
      /* make be like a div for overflow:hidden,
       but can't be div cause helperText is a <p> */
      display: "block",
      // don't want the message to wrap or be really long, so clip it
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      <HelpPopover content={<TextSpan>
        Click the link to see details of the error.
        Click the <Undo/> icon to undo your edit, click it again to
        re-set the field completely.
      </TextSpan>}/>
      <CompactErrorPanel error={valueError}/>
    </span>
  }
  return <>
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField margin="normal" variant="outlined" autoComplete="on"
        fullWidth inputProps={{autoCapitalize: "none"}}
        {...textFieldProps}
        value={value}
        onChange={onValueChange}
        disabled={!!currentAction}
        helperText={<HelperText error={valueError} content={helperText}/>}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton onClick={()=>{
              if( isValueEdited ){
                setValue(loadedValue ?? "");
              }
              else {
                // noinspection JSIgnoredPromiseFromCall
                loadValue();
              }
            }}>
              <Undo/>
            </IconButton>
            <IconButton disabled={!!currentAction || !isValueEdited}
              onClick={onSubmit}
            >
              { !!currentAction ? <CircularProgress size={"1em"}/> : <Save/> }
            </IconButton>
          </InputAdornment>
        }}
      />
    </form>
  </>
}

function HelperText({error, content}:{
  error?: ErrorInfo,
  content?: ReactNode,
}){
  if( !error ){
    return <>{content}</>;
  }
  return <span style={{
    /* make be like a div for overflow:hidden,
     but can't be div cause helperText is a <p> */
    display: "block",
    // don't want the message to wrap or be really long, so clip it
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  }}>
    <HelpPopover content={<TextSpan>
      Click the link to see details of the error.
      Click the <Undo/> icon to undo your edit, click it again to
      re-set the field completely.
    </TextSpan>}/>
    <CompactErrorPanel error={error}/>
  </span>;
}