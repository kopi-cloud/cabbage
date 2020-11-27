import React from 'react';
import './App.css';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";

export const App: React.FC = () => {
  return <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <div>Hello world!</div>

  </MuiThemeProvider>;
};

export const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
      },
    },
  }
});
