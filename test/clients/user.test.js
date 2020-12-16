const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const { Pact, Matchers } = require("@pact-foundation/pact");
const { getUsers } = require("../../clients/user");
const LOG_LEVEL = process.env.LOG_LEVEL || "WARN";

chai.use(chaiAsPromised);

// Alias flexible matchers for simplicity
const { eachLike, like, term, iso8601DateTimeWithMillis } = Matchers;

describe("Pact", () => {
  const provider = new Pact({
    consumer: "consumer",
    provider: "provider",
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: LOG_LEVEL,
    spec: 2,
  });

  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() =>
    provider.setup().then((opts) => {
      // Get a dynamic port from the runtime
      process.env.API_HOST = `http://localhost:${opts.port}`;
    })
  );

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => provider.verify());

  // Configure and import consumer API
  // Note that we update the API endpoint to point at the Mock Service
  const userClient = require("../../clients/user");

  // Verify service client works as expected.
  //
  // Note that we don't call the consumer API endpoints directly, but
  // use unit-style tests that test the collaborating function behaviour -
  // we want to test the function that is calling the external service.
  describe("when a call to get all users", () => {
    describe("and there are users in the datastore", () => {
      before(() =>
        provider.addInteraction({
          state: "Has some users",
          uponReceiving: "a request to get users",
          withRequest: {
            method: "GET",
            path: "/users",
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: [
              {
                firstName: "Oneal",
                lastName: "Anguin",
                email: "oanguin@bots.com",
              },
              {
                firstName: "Not-Found",
                lastName: "Not-Found",
                email: "notfound@notfound.notfound@notfound",
              },
            ],
          },
        })
      );

      it("returns a list of users", (done) => {
        const users = userClient.getUsers();
        expect(users).to.eventually.be.an("array");
        expect(users)
          .to.eventually.to.eql([
            {
              firstName: "Oneal",
              lastName: "Anguin",
              email: "oanguin@bots.com",
            },
            {
              firstName: "Not-Found",
              lastName: "Not-Found",
              email: "notfound@notfound.notfound@notfound",
            },
          ])
          .notify(done);
      });
    });
  });

  describe("when a call to get users", () => {
    describe("and no users in data store", () => {
      before(() =>
        provider.addInteraction({
          state: "No users in data store",
          uponReceiving: "Request for users",
          withRequest: {
            method: "GET",
            path: "/users",
          },
          willRespondWith: {
            status: 404,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: "no users found",
          },
        })
      );

      it("returns an error message", (done) => {
        const users = userClient.getUsers();
        expect(users).to.eventually.to.be.an("error").notify(done);
      });
    });
  });

  describe("when a call to get a user by email is made", () => {
    describe("and a user exists with that email", () => {
      before(() =>
        provider.addInteraction({
          state: "User with email exists",
          uponReceiving: "Request for a user by email",
          withRequest: {
            method: "GET",
            path: term({
              generate: "/users/user@user.com",
              matcher: "/users/[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9.]+$",
            }),
          },
          willRespondWith: {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: { id: like(1), firstName: like("Oneal"), lastName: "Anguin" },
          },
        })
      );

      it("returns a user", (done) => {
        const user = userClient.getUser("user@user.com");
        expect(user).to.eventually.have.deep.property("id", 1).notify(done);
      });
    });
  });

  describe("when a call to get a user by email is made", () => {
    describe("and the user is not found", () => {
      before(() =>
        provider.addInteraction({
          state: "User with email does not exist",
          uponReceiving: "Request for a user by email",
          withRequest: {
            method: "GET",
            path: "/users/notfound@notfound.notfound@notfound",
          },
          willRespondWith: {
            status: 404,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: "no user found",
          },
        })
      );

      it("returns an error message", (done) => {
        const users = userClient.getUser("notfound@notfound.notfound@notfound");
        expect(users).to.eventually.to.be.an("error").notify(done);
      });
    });
  });

  // Write pact files
  after(() => {
    return provider.finalize();
  });
});
