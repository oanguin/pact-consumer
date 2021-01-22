## Running Demo Mock Server

1. Ensure that [Pact Mock Server CLI](https://lib.rs/install/pact_mock_server_cli) is installed
1. Browse to `server` directory
1. Ensure that the Pact server is running in the background
   1. `./pact_mock_server_cli --port 8090 start`
1. Deploy all pacts in `/server/pacts/`
   1. `npm install`
   1. `npm run deploy`
   1. `npm run list`
1. Use sample requests based on ports used for mock servers
   1. `curl http://localhost:59976/users`
