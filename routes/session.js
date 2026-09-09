import formbody from "@fastify/formbody";
import db from "../lib/db.js";

export default async (app, opts) => {
  await app.register(formbody);

  // ==================== GET /login ====================
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

  // ==================== POST /session ====================
  // POST /session - Procesar login (SIN verificar contraseña)
  app.post("/session", { name: "session" }, (req, res) => {
    const { _method, email } = req.body;

     //Logout (DELETE desde formulario HTML)
    if (_method === 'delete') {
      req.session.destroy((err) => {
        if (err) {
          return res.code(500).send({ message: "Error al cerrar sesión" });
        }
        return res.redirect(app.reverse("root"));
      });
      return; // Importante: detener ejecución
    }
    
    //Login. Buscar usuario por email en BD (NO verificar contraseña)
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    
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