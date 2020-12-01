import React from 'react';

const reactGitCommit = process.env.REACT_APP_COMMIT_REF;
const directGitCommit = process.env.COMMIT_REF;

export function App(){
  return <div>
    <div>sb-auth-restore example project</div>
    <div>Build commit: {reactGitCommit}</div>
    <div>Build commit: {directGitCommit}</div>
    <div></div>

  </div>
}

