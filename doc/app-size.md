
## "Empty" project

As of commit `9050e0f7` the size of the client, according to the `build` command:
```
  85.39 KB (+25.59 KB)  build\static\js\2.3166d4ff.chunk.js
  3.51 KB (+3.01 KB)    build\static\js\main.db7fab20.chunk.js
  776 B                 build\static\js\runtime-main.d3b87615.js
  280 B                 build\static\css\main.6873463e.chunk.css
```
Chrome says the same version published on Netlify resulted in 
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


## With Supabase hit counter

As of commit `a6434931`, I've implemented a hit counter with SB, that's one
query and one update statement.

According to the `build` command:
```
  103.21 KB (-70 B)  build\static\js\2.39f9fc0c.chunk.js
  4.83 KB (+161 B)   build\static\js\main.5b25f330.chunk.js
  776 B              build\static\js\runtime-main.d3b87615.js
  280 B              build\static\css\main.6873463e.chunk.css
```
Chrome reports `109 kB transferred`
So that's a bit less than 20KB for Supabase.
    
According to `analyze`:
   
| Name  | Proportion |
| -- | -- |
| react-dom  | 31.4%  |
| material-ui  | 25.6% |
| main.chunk.js | 3.9% |

Most of the supabase doesn't get reported by `analyze` under the `@supabase` 
module.  The analyze results are a bit weird looking, but I don't wanna dig 
into it.  I'm pretty happy with 20KB for supabase - need to keep an eye on it
as I implement more parts, specifically authn/authz and realtime stuff.
There might be a bunch of code being dropped by tree-shaking since I'm not
doing much yet.      

## Before changing to mui v5

As of commit `7d251286`, `build` reports:
```
  147.26 KB  build\static\js\2.f844de94.chunk.js
  16.29 KB   build\static\js\main.948c02b5.chunk.js
  775 B      build\static\js\runtime-main.6fdde2b1.js
  280 B      build\static\css\main.6873463e.chunk.css
```

FireFox reported `168.34 KB transferred` when loading the netlify app,
version `efd162cf`.


## After changing to mui v5

So this is changing the package.json and running the safe codemod.
Still left with lots of code that uses the legacy `makesStyles()` stuff
from the `@mui/styles` package.

As of commit `5e1e4909`, `build` reports:
```
  167.65 KB (+11.7 KB)  build\static\js\2.4bda13d9.chunk.js       
  16.22 KB (+41 B)      build\static\js\main.b729ccb0.chunk.js    
  776 B                 build\static\js\runtime-main.863ad24c.js  
  280 B                 build\static\css\main.6873463e.chunk.css  
```

## After removing legacy styling

Went through all components and pulled out imports of `@mui/styles/makeStyles`,
then removed usage of `StyledEngineProvider` and said import from CabbageTheme.

As of commit `2ba42678`, `build` reports:
```
  155.92 KB (-11.73 KB)  build\static\js\2.d18c238b.chunk.js      
  16.16 KB (-62 B)       build\static\js\main.5751ba25.chunk.js   
  776 B                  build\static\js\runtime-main.863ad24c.js 
  280 B                  build\static\css\main.6873463e.chunk.css 
```