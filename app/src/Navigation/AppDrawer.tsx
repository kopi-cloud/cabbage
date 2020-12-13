import * as React from "react";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import {useNavigation} from "Navigation/NavigationProvider";
import {getUserScreenLink, isUserScreenPath} from "Screen/UserScreen";
import {useLocation} from "Navigation/UseLocation";
import {getOtherScreenLink, isOtherScreenPath} from "Screen/OtherScreen";
import {getScratchScreenLink, isScratchScreenPath} from "Screen/ScratchScreen";


export function AppDrawer(props: {
  anchor: 'left' |'right',
  open: boolean,
  toggleDrawer: (open:boolean)=>void,
}){
  const {currentLocation} = useLocation();

  const sideList = (
    // hardcoded width reminds folks that mobile is a thing
    <div style={{width: 250}}>
      <List>
        <ListNavButton href={getUserScreenLink()}
          isCurrent={isUserScreenPath(currentLocation)}
           description={"User home"}
          icon={<HomeIcon/>}
        />
        <ListNavButton href={getOtherScreenLink()}
          isCurrent={isOtherScreenPath(currentLocation)}
          description="Other stuff" />
        <ListNavButton href={getScratchScreenLink()}
          isCurrent={isScratchScreenPath(currentLocation)}
          description="Scratch" />
      </List>
    </div>
  );

  // const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const onClose = ()=> props.toggleDrawer(false);
  return <SwipeableDrawer
    // disableBackdropTransition={!iOS}
    // disableDiscovery={iOS}
    open={props.open}
    onClose={onClose}
    onOpen={()=> props.toggleDrawer(true)}
    anchor={props.anchor}
  >
    <div
      tabIndex={0}
      role="button"
      onClick={onClose}
      onKeyDown={onClose}
    >
      {sideList}
    </div>
  </SwipeableDrawer>;
}

function ListNavButton(props: {
  href: string,
  description: string,
  icon?: JSX.Element,
  adminOnly?: boolean,
  isCurrent: boolean,
}){
  // const authz = useAuthz();
  const nav = useNavigation();


  // if( props.adminOnly && !authz.isAdmin() ){
  //   // if needs admin but user isn't admin, show nothing
  //   return null;
  // }

  // const isCurrent = currentScreen === props.screen;
  const {isCurrent} = props;
  const description = <span style={{fontWeight: isCurrent ? "bold":"normal"}}>
    {props.description}
  </span>;

  return <ListItem button href={props.href}
    onClick={event=>nav.navigateTo(props.href, event)}
  >
    { props.icon &&
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
    }
    <ListItemText primary={description} />
  </ListItem>;
}
