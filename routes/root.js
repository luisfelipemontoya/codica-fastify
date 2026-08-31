export default async (app, opts) => {
  app.get('/', (req, res) => {
    res.view("src/views/index");
  });

  app.get("/courses", (req, res) => {
    const data = {
      courses: state.courses,
      header: "Cursos de programación"
    };
    res.view("src/views/courses/index", data);
  });

  app.get("/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = state.courses.fina(c => c.id === parseInt(id));

    if (!course) {
      return res.code(404).send({ message: "Course not found"});
      }

      res.view("src/views/courses/show", { course });  
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
