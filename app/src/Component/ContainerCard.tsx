import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import {useMediaQuery} from "@mui/material";

export const maxScreenWidth = 1024;


const useContainerCardStyle = makeStyles(theme=>({
  header: {
    // reduce the spacing around the header, there was too much whitespace
    padding: "0 1em",
    backgroundColor: 'rgba(0,0,0,.1)',
    // if card has no actions header gets short, minHeight keeps it
    // consistent (AboutScreen has one panel with actions and one without)
    minHeight: "3rem",
  },
  headerTitle: {
    // default is h6 and it looks too big to me
    // fontSize: "1.2em"
  },
  headerAction: {
    marginTop: 0,
  },
  // same as header, remove extra whitespace
  content: {
    padding: "1em",
    // deal with possibility of long date / time strings on mobile
    overflowX: "auto",
  },
}));

/* There was some weirdness where the styling of the card header was different
on dev from TST.  This was caused by the order of the "material-ur-root" style
and the jss style generated for useContainerCardStyle being present
in different orders.
When googling for it, I came across a comment on GitHub from the m-ui maintainer
asking if the user was sharing useStyles between components.  That gave my the
idea to factor out this component and it fixed my issue.
Maybe you're not supposed to share usestyles?
 */
export function ContainerCard({ title, action, children}:{
  title: React.ReactNode,
  action?: React.ReactNode,
  children: React.ReactNode,
}){
  const style = useContainerCardStyle();

  return <Card>
    <CardHeader className={style.header} classes={{
      title: style.headerTitle, action: style.headerAction }}
      title={title} titleTypographyProps={{variant: "h6"}}
      action={action}
    />
    <CardContent className={style.content}>
      {children}
    </CardContent>
  </Card>
}

export function useSideMargins():boolean{
  return useMediaQuery('(min-width:22em)', {noSsr: true});
}

export function CardMargin({children}: {  children:React.ReactNode }){
  const showSideMargins = useSideMargins();
  return <div style={{
    marginTop: 0,
    marginBottom: "1em",
    marginLeft: showSideMargins ? "1em" : 0,
    minWidth:"22em",
    maxWidth:"25em",
  }}>
    {children}
  </div>
}

export function FlexCardScreenContainer(props: {
  children:React.ReactNode,
}) {
  return <main style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: "1em",
  }}>
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      maxWidth: maxScreenWidth,
    }}>
      {props.children}
    </div>
  </main>
}
