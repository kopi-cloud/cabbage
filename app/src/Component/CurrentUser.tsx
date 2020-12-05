import React from "react";
import {TextSpan} from "Component/TextSpan";
import {useAuthnUser} from "Api/AuthenticatedUserProvider";

export function CurrentUser(){
  const {user} = useAuthnUser();

  return <TextSpan paragraph>
    Currently signed in as '{user.email ?? 'unknown'}'.
  </TextSpan>
}