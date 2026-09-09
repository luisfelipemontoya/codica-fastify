import yup from "yup";
import formbody from "@fastify/formbody";
import db from "../lib/db.js";

export default async (app, opts) => { 
  await app.register(formbody);
 
  //READ: Listar todos los usuarios
  app.get("/users", { name: "users" }, (req, res) => {
    const flashMessages = res.flash();
    const users = db.prepare("SELECT* FROM users").all();
    
    return res.view("src/views/users/index", { 
      users,
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      flash: flashMessages,
      reverse: app.reverse 
    });  
  });
  
  // READ: Ver usuario específico
  app.get("/users/:id",  { name: "user" }, (req, res) => {
    const { id } = req.params;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    return res.view("src/views/users/show", { 
      user,
      userId: req.session?.userId || null,      
      userName: req.session?.userName || null,
      reverse: app.reverse 
     });
  });

  //CREATE: Formulario de creación
  app.get("/users/new", { name: "newUser" }, (req, res) => {    
    return res.view("src/views/users/new", { 
      userId: req.session?.userId || null,      
      userName: req.session?.userName || null,
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
      reverse: app.reverse
    };
    return res.view("src/views/users/new", data);
  }

  const { name, email, password } = req.body;
  
  // Verificar si el email ya existe
  const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existingUser) {
    req.flash("error", "❌ El correo electrónico ya está registrado");    
    const data = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: req.body.passwordConfirmation || '',
      error: { message: "El correo electrónico ya está registrado"},
      reverse: app.reverse

    };
    return res.view("src/views/users/new", data);
  }

    //Guardar nuevo usuario en BD
    const result = db
      .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name.trim(), email.trim().toLowerCase(), password);

    //Mensaje Flash de éxito
    req.flash("success", "✅Usuario creado correctamente");    
    return res.redirect(app.reverse("users"));
  });

  // UPDATE: Formulario para editar usuario
  app.get("/users/:id/edit", { name: "editUser" }, (req, res) => {
    const { id } = req.params;
    const user = db.prepare("SELECT * FROM users WEHRE id = ?").get(id);

    if (!user) {
      return res.code(404).send({ message: "User not found" });
    }

    return res.view("src/views/users/edit", { 
      user,
      userId: req.session?.userId || null,      
      userName: req.session?.userName || null,
      reverse: app.reverse 
    });
  });

  // UPDATE: Actualizar usuario (POST con _method override para formularios HTML)
  app.post("/users/:id", { name: "updateUser" }, (req, res) => {
    const { id } = req.params;
    const { _method, name, email } = req.body;
    
    // Actualizar (PATCH via _method)
    if (_method === 'patch') {
      db
      .prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
      .run(name.trim(), email.trim().toLowerCase(), parseInt(id));

    req.flash("success", "✅ Usuario actualizado correctamente");   
    return res.redirect(app.reverse("users"));
  }

    // Eliminar (DELETE via _method)
    if (_method === 'delete') {
      db.prepare("DELETE FROM users WHERE id = ?").run(parseInt(id));
      req.flash("success", "✅ Usuario eliminado correctamente"); 
      return res.redirect(app.reverse("users"));
    }

    return res.code(400).send({ message: "Invalid _method" });
  });

  // DELETE: Eliminar usuario (DELETE nativo para APIs)
  app.delete("/users/:id", { name: "deleteUser" }, (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM users WHERE id = ?").run(parseInt(id));
    return res.redirect(app.reverse("users"));
  });
};
