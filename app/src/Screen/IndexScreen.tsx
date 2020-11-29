import {useLocation} from "Navigation/UseLocation";
import {getWelcomeScreenLink} from "Screen/WelcomeScreen";

const log = console;

const indexUrls = ["", "/", "/index", "/index.html"];

export function isIndexPath(path: string){
  const normalizedPath = path.toLowerCase();
  return indexUrls.includes(normalizedPath);
}

export function IndexScreen(){
  const location = useLocation();

  // If user navigated to an "index" url "redirect" them to the welcome screen.
  if( isIndexPath(location.currentLocation) ){
    location.replaceState(getWelcomeScreenLink());
  }

  return null;
}