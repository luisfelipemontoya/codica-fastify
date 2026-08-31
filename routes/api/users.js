const state = {
  users: [
    { id: 1, name: "Felipe Montoya" },
    { id: 2, name: "María González" },
    { id: 3, name: "Carlos Pérez" }
  ]
};

export default async (app, opts) => {
  // GET /api/users
  app.get("/api/users", (req, res) => {
    res.send(state.users);
  });

  // GET /api/users/:id
  app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = state.users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    res.send(user);
  });
};
