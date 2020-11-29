import * as React from "react";
import {ErrorInfo} from "Error/ErrorUtil";
import {CompactErrorPanel} from "Error/CompactErrorPanel";

const justifyLeftPadding = {paddingRight: ".35em", paddingBottom: ".35em"};
const justifyRightPadding = {paddingLeft: ".35em", paddingBottom: ".35em"};

type SpanProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement >;

/** adds padding to avoid buttons touching (especially if wrapped on a
 very small device */
export function ButtonContainer({
  children,
  justifyRight,
  error,
  ...spanProps
}: {
  children: React.ReactNode,
  justifyRight?: boolean,
  error?: ErrorInfo,
} & SpanProps ){
  const buttonPadding = justifyRight ?
    justifyRightPadding : justifyLeftPadding;
  const errorComponent = <span style={{...buttonPadding, marginBottom: ".35em"}}>
    <CompactErrorPanel error={error}/>
  </span>;

  return <div>
    { justifyRight && errorComponent }
    <span {...spanProps} style={{
      display: "flex", flexWrap: "wrap",
      justifyContent: justifyRight ? "flex-end" : "flex-start",
      ...spanProps.style,
    }}>
      {React.Children.map(
        children, i =>{
          if( i === undefined || i === null ){
            return null;
          }
          return <span style={buttonPadding}>
            {i}
          </span>
        }
      )}
    </span>
    { (!justifyRight) && errorComponent }
  </div>
}
