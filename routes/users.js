import formbody from "@fastify/formbody";

//Datos temporales
const state = {
  users: [
    { id: 1, name: "Felipe Montoya" },
    { id: 2, name: "María González" },
    { id: 3, name: "Carlos Pérez" }
  ]
};

export default async (app, opts) => {  
  app.register(formbody);

  app.get("/users", (req, res) => {
    res.view("src/views/users/index", { users: state.users });  
  });
  
  //Formulario de creación
  app.get("/users/new", (req, res) => {
    res.view("src/views/users/new");
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
    const { name, email, password, passwordConfirmation } = req.body;
    
    if (password !== passwordConfirmation) {
      return res.code(400).send({ message: "Las contraseñas no coinciden"});
    }

    //Normalizar y crear nuevo usuario
    const newUser = {
      id: state.users.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    state.users.push(newUser); 

    res.redirect("/users");
  });
};
