export default async (app, opts) => {
  app.get('/', (req, res) => {
    res.view("src/views/index");
  });

  app.get("/about", (req, res) => {
    res.send("About this project");
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
