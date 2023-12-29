# Bun + SurrealDB Example Web Server

## Requirements

- [SurrealDB](https://docs.surrealdb.com/docs/installation/overview)
  - the CLI needs to be installed to run `bun run import:test-data`
- Docker (or suitable alternative, I love [OrbStack](https://orbstack.dev/))
- Bun
- [Optional] [Surrealist: Query Explorer for SurrealDB](https://github.com/StarlaneStudios/Surrealist)
  - Handy tool for playing arround with the test data. 

## Getting Started

1. Clone this repo
2. Run `bun install`
3. Run `docker compose up -d`
   1. This will start surreal db @ localhost:8000 without authentication
4. Run `bun run import:test-data`
   1. This will import the test data into the surreal db instance
5. Run `bun run start`
   1. This will start the server @ localhost:8080

## Test Data Model
<img width="1744" alt="surreal_deal_dark" src="https://github.com/NickMoignard/surreal-test/assets/13538178/7b2fa068-57ef-4394-9df0-52f36a69bf03">
