/** This component deals with unexpected errors (usally programming errors)
 * during component rendering.
 * See https://reactjs.org/docs/error-boundaries.html
 * Has to be a class because React error boundaries only work with class
 * components AFAIK.
 * Needs to be separate from ErrorDialog because that's designed to show
 * errors while still rendering the normal component hierarchy - we can't
 * show the component hierarchy while it's causing errors.
 */
import {TextSpan} from "Component/TextSpan";
import {Divider} from "@material-ui/core";
import {LargeScreenContainer} from "Component/Screen";
import * as React from "react";
import {ErrorInfoComponent} from "Error/ErrorInforComponent";

export class ReactErrorBoundary extends React.Component {
  state = {} as { hasError: undefined|Error };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.log("unhandled react error", error, info);
  }

  render() {
    if( !this.state.hasError ){
      return this.props.children;
    }

    return <LargeScreenContainer>
      <ErrorInfoComponent error={{
        message: "unhandled rendering error",
        problem: this.state.hasError,
      }}/>
      <br/><Divider/><br/>
      <TextSpan>
        Things to try:
        <ul>
          <li>Click the refresh button in your browser</li>
          <li>Edit the URL location to remove any parameters (everything from
            the '#' character to the end)</li>
          <li>Do a "hard refresh" of your browser (shift-click, ctrl+F5 etc.
            - see links below)
          </li>
          <li>Log out of the app (including SSO logout).</li>
          <li>Clear local state like cookies / local storage for the
            current site
          </li>
          <li>Clear local state like cookies / local storage for all
            sites
          </li>
          <li>Update your browser version</li>
          <li>Contact support</li>
        </ul>
        More information:
        <ul>
          <li><a target="_blank" rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">
            About doing a "hard refresh"
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer"
            href="https://refreshyourcache.com/en/safari-mobile/">
            About clearing your cache
          </a></li>
          <li><a target="_blank" rel="noopener noreferrer"
            href="https://refreshyourcache.com/en/safari-mobile/">
            About updating your browser
          </a></li>
        </ul>
      </TextSpan>
    </LargeScreenContainer>
  }
}

