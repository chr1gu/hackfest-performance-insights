This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
yarn build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

# Server Timing Headers

The server timing headers are expected to be of the following format:

\<name>;desc=\<description>;dur=\<durationMs>;offset=\<offsetMs>

- Name: Name of the service
- Description: Description - we use this to determine the hierarchy of the requests
- DurationMs: Duration of the request in ms
- OffsetMs: Optional - request start offset in ms relative to parent request

## Supported server-timing header types

### Akamai

`edge; dur=14` Edge duration

`origin; dur=96` Origin duration - normally the root parent

### Iso

`iso; desc=total; dur=77` Total duration of iso request - parent of render and getInitialProps

`iso; desc=getInitialProps; dur=27` GetInitialProps duration - parent of data fetching requests

`iso; desc=render; dur=50` Render duration - happens after GetInitialProps

### Supergraph

`dg-trace-gql-gateway; desc=<query-name>; dur=18` GraphQL Gateway request - total duration. Description is the query name

`dg-trace-gql-subgraph_<subgraph-name>; desc=<query-name>; dur=4; offset=14` Subgraph Request. Query name matches gateway request and is used to determine the parrent name.

### Grapholith

`dg-trace-gql-grapholith;description=<query-name>;dur=2` Grapholith request
