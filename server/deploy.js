require("dotenv").config();
const fs = require("fs");
const superagent = require("superagent");
const pactServerURL = `http://${process.env.PACT_SERVER_HOST}:${process.env.PACT_SERVER_PORT}`;

const deployMocks = async () => {
  console.log("Deploying Mocks");

  const servers = await getMockServers();

  const dir = await fs.promises.opendir("./pacts");

  for await (const file of dir) {
    fs.readFile(`./pacts/${file.name}`, "utf8", (err, dataString) => {
      const mock = JSON.parse(dataString);

      const mockServer = servers.mockServers.find(
        (i) => i.provider === mock.provider.name
      );

      if (mockServer) {
        clearMock(mockServer.id);
      }

      superagent
        .post(pactServerURL)
        .send(mock)
        .set("accept", "application/json")
        .then((res) => console.log(res.body))
        .catch(console.error);
    });
  }
};

const getMockServers = async () => {
  try {
    return await superagent.get(pactServerURL).then((res) => res.body);
  } catch (error) {
    console.log(error);
  }
};

const clearMock = async (id) => {
  await superagent.delete(`${pactServerURL}/mockserver/${id}`);
};
deployMocks();
