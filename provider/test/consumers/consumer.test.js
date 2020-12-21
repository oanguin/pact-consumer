const { Verifier } = require("@pact-foundation/pact");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { app, importData, repo } = require("../../app");
chai.use(chaiAsPromised);
const path = require("path");

app.listen(3002, () => {
  importData();
  console.log("Provider Service listening on http://localhost:3002");
});

describe("Pact verification", () => {
  it("validates the expection of the matching service", () => {
    let opts = {
      provider: "Provider",
      consumer: "Consumer",
      providerBaseUrl: "http://localhost:3002",
      pactUrls: [
        path.resolve(
          __dirname,
          "../../../consumer/pacts/consumer-provider.json"
        ),
      ],
      stateHandlers: {
        "No users in data store": () => {
          repo.clear();
          return Promise.resolve(`Users removed to the db`);
        },
      },
    };

    return new Verifier(opts).verifyProvider().then((output) => {
      console.log("Pact Verification Complete!");
      console.log(output);
    });
  });
});
