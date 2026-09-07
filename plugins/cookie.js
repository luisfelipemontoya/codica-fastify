import fp from "fastify-plugin";
import cookie from "@fastify/cookie";

export default fp(async (app, options) => {
  await app.register(cookie);
});