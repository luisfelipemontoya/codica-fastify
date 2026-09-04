import yup from "yup";
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
  await app.register(formbody);
 
  //READ: Listar todos los usuarios
  app.get("/users", { name: "users" }, (req, res) => {
    res.view("src/views/users/index", { 
      users: state.users,
      reverse: app.reverse 
    });  
  });
  
  //CREATE: Formulario de creación
  app.get("/users/new", { name: "newUser" }, (req, res) => {
    res.view("src/views/users/new", { reverse: app.reverse });
  });

  // READ: Ver usuario específico
  app.get("/users/:id",  { name: "user" },  (req, res) => {
    const { id } = req.params;
    const user = state.users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    res.view("src/views/users/show", { 
      user,
      reverse: app.reverse 
     });
  });

  // CREATE: Crear usuario (POST /users) + validación
  app.post("/users", {
    attachValidation: true,
    schema: {
       body: yup.object({
        name: yup.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        email: yup.string().email("Formato de email inválido"),
        password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        passwordConfirmation: yup.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      if (data.password !== data.passwordConfirmation) {
        return {
          error: new Error("Las contraseñas no coinciden"),
        };
      }
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };      
    }
  }, 
}, (req, res) => { 
  if (req.validationError) {
    const data = {
      name: req.body.name || '',
      email: req.body.email || '',
      password: req.body.password || '',
      passwordConfirmation: req.body.passwordConfirmation || '',
      error: req.validationError,
    };
    return res.view("src/views/users/new", data);
  }

  const { name, email, password } = req.body;
  
    //Datos válidos: Normalizar y guardar
    const newUser = {
      id: state.users.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    state.users.push(newUser); 

    res.redirect(app.reverse("users"));
  });

  // UPDATE: Formulario para editar usuario
  app.get("/users/:id/edit", { name: "editUser" }, (req, res) => {
    const { id } = req.params;
    const user = state.users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    res.view("src/views/users/edit", { 
      user,
      reverse: app.reverse 
    });
  });

  // UPDATE: Actualizar usuario (POST con _method override para formularios HTML)
  app.post("/users/:id", { name: "updateUser" }, (req, res) => {
    const { id } = req.params;
    const { _method, name, email } = req.body;
    const userIndex = state.users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.code(404).send({ message: "User not found" });
    }

    // Actualizar (PATCH via _method)
    if (_method === 'patch') {
      state.users[userIndex] = { 
        ...state.users[userIndex], 
        name: name.trim(), 
        email: email.trim().toLowerCase() 
    };

    return res.redirect(app.reverse("users"));
  }

    // Eliminar (DELETE via _method)
    if (_method === 'delete') {
      state.users.splice(userIndex, 1);
      return res.redirect(app.reverse("users"));
    }

    return res.code(400).send({ message: "Invalid _method" });
  });

  // DELETE: Eliminar usuario (DELETE nativo para APIs)
  app.delete("/users/:id", { name: "deleteUser" }, (req, res) => {
    const { id } = req.params;
    const userIndex = state.users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.code(404).send({ message: "User not found" });
    }

    state.users.splice(userIndex, 1);
    res.redirect(app.reverse("users"));
  });
};
