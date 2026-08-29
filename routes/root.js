export default async (app, opts) => {
  app.get('/', (req, res) => {
    res.send("Hello World!");
  });

  app.get("/about", (req, res) => {
    res.send("About this project");
  });

  app.get("/users", (req, res) => {
    res.send("GET /users");
  });

  app.post("/users", (req, res) => {
    res.send("POST /users");
  });

  app.get("/api/users", (req, res) => {
    res.json([{ id: 1, name: "Felipe Montoya" }])
  })
};
