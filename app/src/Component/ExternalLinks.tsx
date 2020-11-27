import * as React from "react";
import {OpenInNew} from "@material-ui/icons";

export const cabbageGithubUrl = "https://github.com/kopi-cloud/cabbage";
export const supabaseUrl = "https://supabase.io";
export const netlifyUrl = "https://netlify.com";
export const cabbageTstUrl = "https://rabbit-cabbage.netlify.app/";

export function NewWindowLink(props: {
  href: string,
  children: React.ReactNode,
}){
  return <a href={props.href}
    target="_blank" rel="noopener noreferrer"
    style={{whiteSpace: "nowrap"}}
  >
    {props.children}{" "}
    <OpenInNew style={{
      // align with text better
      verticalAlign: "bottom"
    }}/>
  </a>
}


