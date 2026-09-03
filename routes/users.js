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
 
  //Listar todos los usuarios
  app.get("/users", { name: "users" }, (req, res) => {
    res.view("src/views/users/index", { 
      users: state.users,
      reverse: app.reverse 
    });  
  });
  
  //Formulario de creación
  app.get("/users/new", { name: "newUser" }, (req, res) => {
    res.view("src/views/users/new", { reverse: app.reverse });
  });

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

  // Crear usuario (POST /users) + validación
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
};
