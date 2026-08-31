
//Datos temporales
const state = {
  users: [
    { id: 1, name: "Felipe Montoya" },
    { id: 2, name: "María González" },
    { id: 3, name: "Carlos Pérez" }
  ]
};

export default async (app, opts) => {  
  app.get("/users", (req, res) => {
    res.view("src/views/users/index", { users: state.users });  
  });
  
  app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = state.users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    res.view("src/views/users/show", { user });
  });

  // Crear usuario (POST /users)
  app.post("/users", (req, res) => {    
    res.send("POST /users");
  });
};
