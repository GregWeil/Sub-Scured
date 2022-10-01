import { join } from "path";
import fastifyServer from "fastify";
import fastifyStatic from "@fastify/static";

const server = fastifyServer({ logger: false });

server.register(fastifyStatic, {
  root: join(process.cwd(), "public"),
  prefix: "/",
});

server.register(fastifyStatic, {
  root: join(process.cwd(), "build"),
  prefix: "/build",
  decorateReply: false,
});

server.listen(
  { port: Number(process.env.PORT), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
