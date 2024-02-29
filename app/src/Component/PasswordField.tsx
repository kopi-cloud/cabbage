import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { analytics } from "segment";


export function PasswordField(props: TextFieldProps ){
  const [showPassword, setShowPasword] = useState(false);

  function onClickShowPassword(){
    setShowPasword(value => !value);
    analytics.track({
      event: "Show Password Clicked",
      properties: {
        showPassword: !showPassword
      },
      type: "track"
    })
  }

  function handleMouseDownPassword(e: SyntheticEvent){
    e.preventDefault();
  }

  return (
    <TextField {...props}
      label={props.label ?? "Password"}
      margin="normal"
      variant="outlined"
      autoComplete="on"
      fullWidth={true}
      inputProps={{autoCapitalize: "none"}}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: <InputAdornment position="end">
          <IconButton
            onClick={onClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            size="large">
            {showPassword ? <Visibility/> : <VisibilityOff/>}
          </IconButton>
        </InputAdornment>
      }}
    />
  );
}