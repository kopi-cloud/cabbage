
## "Empty" project

As of commit 9050e0f7 the size of the client, according to the `build` command:
```
  85.39 KB (+25.59 KB)  build\static\js\2.3166d4ff.chunk.js
  3.51 KB (+3.01 KB)    build\static\js\main.db7fab20.chunk.js
  776 B                 build\static\js\runtime-main.d3b87615.js
  280 B                 build\static\css\main.6873463e.chunk.css
```
Firefox says the same version published on Netlify resulted in 
`88.4kB transferred`.

So that's a full c-r-a build with material-ui as the component library.
According to the `analyze` command, that's 293.97 KB unzipped.

According to `analyze`:
   
| Name  | Proportion |
| -- | -- |
| react-dom  | 40%  |
| material-ui  | 32% |
| main.chunk.js | 3.5% |

The rest of it is a bunch of small stuff from material-ui, react and 
create-react-app, etc.  JSS, babel, module loading.

Note that even just for this simple functionality, I've actually pulled in 
quite a few material-ui components, mostly for error handling, 
progress feedback, etc.


## With Supabase login

Not done yet.

    