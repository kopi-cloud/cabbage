import React from 'react';

// supplied by the build command in netlify.toml
const reactGitCommit = process.env.REACT_APP_COMMIT_REF;

export function App(){
  return <>
    <Info/>
  </>
}

function Info(){
  return <div>
    <div>sb-auth-restore example project</div>
    <div>Built from Git commit: {reactGitCommit}</div>
  </div>
}

