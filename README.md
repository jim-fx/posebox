# Welcome to the Poser Monorepo

## Setup / Installation

1. [Install Node](https://nodejs.org/en/download/)

2. Install pnpm

   `npm i -g pnpm`

3. Install dependancies

   `pnpm i -r`

4. Start developing

   `pnpm dev`

5. Open https://localhost:8080

## Requirements

Because the backend server uses @tensorflow/tfjs-node, which uses c++ bindings to the native tensorflow. You need to install a compiler. When you run `pnpm i -r` it should tell you what you need to install.
