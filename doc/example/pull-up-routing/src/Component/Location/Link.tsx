import React, {AnchorHTMLAttributes, ReactNode} from "react";
import {useLocationPathname} from "Component/Location/UseLocationPathname";

export function Link(params:
  { href: string, children: ReactNode } &
    AnchorHTMLAttributes<HTMLAnchorElement>
){
  const {children, href, onClick, ...rest} = params;
  const pathContext = useLocationPathname();
  return <a {...rest} href={href} onClick={(e) => {
    e.preventDefault();
    pathContext.pushState(href);
  }}>{children}</a>
}