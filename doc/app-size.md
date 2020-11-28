
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