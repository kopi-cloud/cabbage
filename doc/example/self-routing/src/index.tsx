import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "App";

console.debug("intial App render()");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

