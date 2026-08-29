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
  });

  app.get("/hello", (req, res) => {
    const name = req.query.name; 
    res.send(`Hello, ${name ? name : "World"}!`);
  });

  app.get("/users/:userId/post/posts/:postId", (req, res) => {
    const { userId, postId } = req.params; 
    res.send(`User ID: ${userId}; Post ID: ${postId}`);
  });
};
