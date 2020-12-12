import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {ErrorInfo, isErrorInfo} from "Error/ErrorUtil";
import {useIsMounted} from "Util/ReactUtil";
import {delay, stopClick} from "Util/EventUtil";
import TextField from "@material-ui/core/TextField/TextField";
import {CompactErrorPanel} from "Error/CompactErrorPanel";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextFieldProps
} from "@material-ui/core";
import {Save, Undo} from "@material-ui/icons";
import { HelpPopover } from "./HelpPopover";
import { TextSpan } from "./TextSpan";

type Props = {
  readValue: ()=>Promise<string|ErrorInfo>,
  writeValue: (value:string)=>Promise<undefined|ErrorInfo>,
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
    await delay(1000, "show spinner delay");
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
    const result = await writeValue(value);
    if( !isMounted.current ){
      return;
    }
    await delay(1000, "show spinner delay");
    if( isErrorInfo(result) ){
      setValueError(result);
    }
    setCurrentAction(undefined);
  }

  function onValueChange(e: ChangeEvent<HTMLInputElement>){
    stopClick(e);
    setValue(e.currentTarget.value as string);
  }

  const isValueEdited = loadedValue !== value;
  return <>
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField
        margin="normal"
        variant="outlined"
        autoComplete="on"
        fullWidth
        inputProps={{autoCapitalize: "none"}}
        {...textFieldProps}
        value={value}
        onChange={onValueChange}
        disabled={!!currentAction}
        helperText={ valueError ?
          <>
            <HelpPopover content={<TextSpan>
              Click the link to see details of the error.
              Click the <Undo/> icon to undo your edit, click it again to
              re-set the field completely.
            </TextSpan>}/>
            <CompactErrorPanel error={valueError}/>
          </> : helperText
        }
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
