import React from "react";

// supplied by the build command in netlify.toml
const gitCommit = process.env.REACT_APP_COMMIT_REF ?? 'main';

export function CommitInfo(){
  const sourceUrl = `https://github.com/kopi-cloud/cabbage/tree/${gitCommit}` +
    '/doc/example/context-observer';
  return <div>
    <div>
      Source on <a href={sourceUrl}>Github</a>,
      built from commit: {gitCommit}
    </div>
  </div>
}