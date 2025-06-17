# Performance Insights Extension

This extension provides performance insights on a per-request basis.
The extension adds some pragma headers to each request to our domains that will tell the backends to add additional information as headers (mostly server-timing headers) to the response.
These additional information are then displayed in the devtools.

## Pragma Headers

| Pragma              | Response                                                                          |
| ------------------- | --------------------------------------------------------------------------------- |
| `dg-gql`            | Add server-timing for all GraphQL Gateway requests                                |
| `dg-gql-subgraph`   | Add server-timing for all Subgraph requests                                       |
| `dg-grapholith`     | Add server-timing for all Grapholith requests                                     |
| `dg-frontend`       | Add server-timing headers for the iso request (total, getInitialProps and render) |
| `dg-authentication` | Add additional response headers for the token-refresh requests                    |
| `dg-akamai-bc`      | Add server-timing headers from Akamai (edge, origin)                              |

## Server Timing Headers

The server timing headers are expected to be of the following format:

`<name>; desc=<description>; dur=<durationMs>; offset=<offsetMs>`

- `name`: Name of the service
- `description`: Description - we use this to determine the hierarchy of graphql requests
- `durationMs`: Duration of the request in ms
- `offsetMs`: Optional - request start offset in ms relative to parent request

The following types of server-timing headers are currently picked up and displayed

### Akamai

| Example          | Description                                |
| ---------------- | ------------------------------------------ |
| `edge; dur=14`   | Edge duration                              |
| `origin; dur=96` | Origin duration - normally the root parent |

### Iso

| Example                                       | Description                                                          |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `iso; desc=total; dur=77`                     | Total duration of iso request - parent of render and getInitialProps |
| `iso; desc=getInitialProps; dur=27; offset=2` | GetInitialProps duration - parent of data fetching requests          |
| `iso; desc=render; dur=50; offset=31`         | Render duration - happens after GetInitialProps                      |

### Supergraph

| Example                                                    | Description                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `gql; desc=<query-name>; dur=18; offset=1`                 | GraphQL Gateway request - total duration. Description is the query name                        |
| `gql_<subgraph-name>; desc=<query-name>; dur=4; offset=14` | Subgraph Request. Query name matches gateway request and is used to determine the parent name. |

### Grapholith

| Example                                                  | Description        |
| -------------------------------------------------------- | ------------------ |
| `grapholith; description=<query-name>; dur=2; offset=12` | Grapholith request |
