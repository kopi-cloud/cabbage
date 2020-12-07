import React from "react";
import {TextSpan} from "Component/TextSpan";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";

export function CurrentUser(){
  const {user} = useAuthnUser();

  return <TextSpan>
    Currently signed in as '{user.email ?? 'unknown'}'
    via {user.app_metadata.provider}.
  </TextSpan>
}