import fp from "fastify-plugin";
import flash from "@fastify/flash";

export default fp(async (app, options) => {
    await app.register(flash);
});

