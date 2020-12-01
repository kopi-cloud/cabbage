import React from 'react';
import {EmailLogin} from "./EmailLogin";

// supplied by the build command in netlify.toml
const gitCommit = process.env.REACT_APP_COMMIT_REF;

// const log = console;

export function App(){
  return <>
    <Info/>
    <EmailLogin/>
  </>
}

function Info(){
  const sourceUrl = `https://github.com/kopi-cloud/cabbage/tree/${gitCommit}` +
    '/doc/example/sb-auth-restore';
  return <div>
    <div>sb-auth-restore example project</div>
    <div>
      Source on <a href={sourceUrl}>Github</a>,
      built from commit: {gitCommit}
    </div>
  </div>
}

