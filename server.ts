import { join } from "path";
import * as fastify from "fastify";
import * as fastifyStatic from "@fastify/static";

// Require the fastify framework and instantiate it
const server = fastify({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
server.register(fastifyStatic, {
  root: join(process.cwd(), "public"),
  prefix: "/",
});
server.register(fastifyStatic, {
  root: join(process.cwd(), "build"),
  prefix: "/build",
  decorateReply: false,
});

// Run the server and report out to the logs
server.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
