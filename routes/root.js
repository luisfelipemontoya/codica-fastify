export default async (app, opts) => {
  app.get('/', { name: "root" }, (req, res) => {
    res.view("src/views/index", { reverse: app.reverse } );
  });

  app.get("/about", { name: "about" }, (req, res) => {
    res.send("About this project", { reverse: app.reverse } );
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
