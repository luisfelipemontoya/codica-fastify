import fp from "fastify-plugin";
import view from "@fastify/view";
import pug from "pug";

export default fp(async (app, options) => {
    await app.register(view, { 
        engine: { pug },
         defaultContext: {
            route: (name, params) => app.reverse(name, params),
        },
    });
});