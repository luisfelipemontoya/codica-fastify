export default async (app, opts) => {
  app.get('/', (req, res) => {
    res.send("Hello World!");
  });
};
