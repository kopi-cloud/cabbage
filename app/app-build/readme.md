I'm planning that this is where I will write my own code to generate
types into `/src/Generated` since openapi-typescript is not very useful.

Ideally, I'd like this directory to be an NPM project itself, so it can
use library dependencies and even it's own build step so it could be written
in typescript.

What I'm trying to achieve here is a solution similar to the gradle buildSrc
idea of a special "sub-project" that gets built before and can be used by
the real app's actual build process.
https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources

What I don't want to do though, is go the whole way to publishing a
standalone project to NPM. I don't want to build a whole standlone product,
I just want a place to write some "build logic".

