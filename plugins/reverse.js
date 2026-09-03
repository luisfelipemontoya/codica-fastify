import fp from "fastify-plugin";

const reversePlugin = (app, _options, done) => {
  const routes = new Map();

  app.decorate("reverse", (name, params = {}) => {
    const url = routes.get(name);
    if (!url) {
      throw new Error(`Route with name ${name} is not registered`);
    }
    return url.replace(/:(\w+)/g, (_match, key) => {
      if (!(key in params)) {
        throw new Error(`Route ${name} needs param ${key}`);
      }
      return params[key];
    });
  });

  app.addHook("onRoute", ({ name, url, method }) => {
    if (!name || method === "HEAD") return;
    if (routes.has(name)) {
      throw new Error(`Route ${name} already registered`);
    }
    routes.set(name, url);
  });

  done();
};

export default fp(reversePlugin, { name: "reverse" });