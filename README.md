# Metazen Frontend SDK

This repo contains the code to render the frontend of the Gryfyn Wallet. Authentication is done with standard OIDC flow, implemented with Keycloak.

## UI

Use [Material UI V5.](https://mui.com/material-ui/getting-started/overview/)

## Prerequisites

We recommend using the same node version as the one specified in the Dockerfile.

You can also use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

## Available Scripts

Please only use `npm` in this project to avoid any issues.

In the project directory, you can run:

## Installation

```shell
npm i
```

## Running locally

Simply copy the contents of .env.example into .env.local, and run the start command. This will run a local instance of the Gryfyn Wallet frontend, connected to the alpha version of all the backends.

```shell
cp .env.example .env.local
npm start
```

Optionally, you can run a local mock API server. Remember to change the endpoints of the APIs in the `.env.local` file. Please note that the local mock API server is no longer being maintained, so there will most likely be issues.

```shell
npm run dev
```

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Folder Structure

**apis/**

will be separate into `lib/`and `services/`later

**blockchains/**
TBC whether we should migrate it to `utils`

**components/**
Common components that share between pages.
Keep in mind that components here should not get external/global data by itself (i.e. `useLocation`, `useNavigate`, `useSelector`)
PS `useState`, `useEffect` is acceptable

**constants/**
storing global constant variables.

**contexts/**
React context that use in pages.

**demo/**
Demo/testing related code, such as REVV racing/Dustland Runner wallet props.

**hooks/**
React hook that use in pages.

**layouts/**
Page layout based components for pages/routing. Also including page header bar, bottom tab navigation...etc.

**lib/ (Coming soon)**
Library functions that used in the project, e.g. JRPC client

**lib-deprecated/**
Deprecated folder, will remove once reconstruction complete.

**pages/**
One folder represent a independent page of the wallet, also page-specific components/hooks will be in here.

**redux/**
Redux stuff including store, reducer, RTK-Query, selector.

**theme/**
App theme definition

**types/**
Types for response object, DTO...etc.

**utils/**
Storing utilities functions

# Tests

Unit test (with Jest) will focus on business logic and state transition. TBC for component styling.
TODO: add unit test for redux flow

## Code Styling

We're using ESLint and Prettier to handle most of the code styling, and here's some extra suggestion:

- make sure you installed ESLint and Prettier on VS Code
- Avoid `any` in your code (will be restricted with ESLint later)
- Recommend using named export rather than default export (exception: import Material UI components, see [here](https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports))
- Suggestion for import statement grouping/ordering 1. React 2. installed library (e.g. bignumber.js, react-router-dom) 3. @mui/materials 4. @mui/icons-material 5. imports with path aliases (suggested group by type) 6. relative import
  Example: ![enter image description here](https://i.ibb.co/vxG7qrV/image.png)

- Using named export (`export const xxx = yyy;`)
