import formbody from "@fastify/formbody";

//Datos temporales
const state = {
  users: [
    { id: 1, name: "Felipe Montoya", email: "felipe@example.com", password: "123456" },
    { id: 2, name: "María González", email: "maria@example.com", password: "123456" }
  ]
};

export default async (app, opts) => {
  await app.register(formbody);

  // GET /login - Mostrar formulario de login
  app.get("/login", { name: "login" }, (req, res) => {
    const flashMessages = res.flash();

    return res.view("src/views/sessions/new", {
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      flash: flashMessages,
      reverse: app.reverse 
    });
  });

  // POST /session - Procesar login (SIN verificar contraseña)
  app.post("/session", { name: "session" }, (req, res) => {
    const { _method, email } = req.body;

     // Si es logout (DELETE desde formulario HTML)
    if (_method === 'delete') {
      req.session.destroy((err) => {
        if (err) {
          return res.code(500).send({ message: "Error al cerrar sesión" });
        }
        return res.redirect(app.reverse("root"));
      });
      return; // Importante: detener ejecución
    }
    
    // Si es login. Buscar usuario por email (NO verificar contraseña)
    const user = state.users.find(u => u.email === email);
    
    if (!user) {
    req.flash("error", "❌ Usuario no encontrado");
      return res.view("src/views/sessions/new", {
        error: "Usuario no encontrado",
        email: email,
        userId: req.session?.userId || null,
        userName: req.session?.userName || null,
        reverse: app.reverse
      });
    }
    
    // Iniciar sesión SIN verificar contraseña
    req.session.userId = user.id;
    req.session.userName = user.name;

    req.flash("success", "✅ ¡Bienvenido, " + user.name + "!");
    return res.redirect(app.reverse("root"));
  });
 
  // DELETE /session - Cerrar sesión (API nativa)
  app.delete("/session", { name: "logout" }, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.code(500).send({ message: "Error al cerrar sesión" });
      }
    return res.redirect(app.reverse("root"));
    });
  });
};