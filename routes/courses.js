import yup from "yup";
import formbody from "@fastify/formbody"; 
import db from "../lib/db.js";

export default async (app, opts) => {
  await app.register(formbody);

   // ==================== READ ====================
  // READ:Listar todos los cursos (GET /courses)
  app.get("/courses", { name: "courses" }, (req, res) => {
    const flashMessages = res.flash();
    const { term } = req.query; // Obtener parámetro de búsqueda
    let query = "SELECT * FROM courses";
    let params = [];

    if (term) {
      query = "SELECT * FROM courses WHERE title LIKE ? OR description LIKE ?";
      params = [`%${term}%`, `%${term}%`];
    }

    const courses = db.prepare(query).all(...params);

    // Convertir tags de string a array
    const coursesWithTags = courses.map(course => ({
      ...course,
      tags: course.tags ? course.tags.split(',') : []
    }));

    const data = {
      courses: coursesWithTags,
      term: term || '', // Mantener el valor en el input
      header: "Cursos de programación",
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      flash: flashMessages,
      reverse: app.reverse
    };  
    
    return res.view("src/views/courses/index", data);
  });

    //READ: Listar 1 curso específico (GET /courses/:id)
  app.get("/courses/:id", { name: "course" }, (req, res) => {
    const { id } = req.params;
    const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);

    if (!course) {
      return res.code(404).send({ message: "Course not found" });
    }

    return res.view("src/views/courses/show", { 
      course: {
      ...course,
      tags: course.tags ? course.tags.split(',') : [] 
      },
      userId: req.session?.userId || null,
      userName: req.session?.userName || null, 
      reverse: app.reverse  
    });
  });

    // ==================== CREATE ====================
  //CREATE: Formulario para crear curso (GET /courses/new)
  app.get("/courses/new",  { name: "newCourse" }, (req, res) => {
    const flashMessages = res.flash(); 
    return res.view("src/views/courses/new", { 
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      flash: flashMessages, 
      reverse: app.reverse });
  });

  // CREATE: Crear curso (POST /courses) + validación
  app.post("/courses", {
    attachValidation: true,
    schema: {
      body: yup.object({
        title: yup.string().min(2, "El título debe tener al menos 2 caracteres"),
        description: yup.string().min(10, "La descripción debe tener al menos 10 caracteres"),
        duration: yup.number().min(1, "La duración debe ser al menos 1 hora"),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
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
        title: req.body.title || '',
        description: req.body.description || '',
        duration: req.body.duration || '',
        error: req.validationError,
        reverse: app.reverse 
      };
      return res.view("src/views/courses/new", data);
    }

    //Datos válidos: guardar curso
    const { title, description, duration } = req.body;

    const result = db
      .prepare("INSERT INTO courses (title, description, duration) VALUES (?, ?, ?)")
      .run(title.trim(), description.trim(), parseInt(duration));

    req.flash("success", "✅ Curso creado correctamente");    
    return res.redirect(app.reverse("courses"));
  });

   // ==================== UPDATE ====================
  // UPDATE: Formulario para editar curso (Añadir nueva funcionalidad -edit)
  app.get("/courses/:id/edit", { name: "editCourse" }, (req, res) => {
    const { id } = req.params;
    const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id); 
    const flashMessages = res.flash();

    if (!course) {
      return res.code(404).send({ message: "Course not found" });
    }

    return res.view("src/views/courses/edit", { 
      course,
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      flash: flashMessages,
      reverse: app.reverse 
    });
  });

   // UPDATE: Actualizar curso (POST con _method)
  app.post("/courses/:id", { name: "updateCourse" }, (req, res) => {
    const { id } = req.params;
    const { _method, title, description, duration } = req.body;
    
    // Actualizar (PATCH via _method)
    if (_method === 'patch') {
      db
        .prepare("UPDATE courses SET title = ?, description = ?, duration = ? WHERE id = ?")
        .run(title.trim(), description.trim(), parseInt(duration), parseInt(id));

      req.flash("success", "✅ Curso actualizado correctamente"); 
      return res.redirect(app.reverse("courses"));
    }

    // Eliminar (DELETE via _method)
    if (_method === 'delete') {
      db.prepare("DELETE FROM courses WHERE id = ?").run(parseInt(id));
      req.flash("success", "✅ Curso eliminado correctamente"); 
      return res.redirect(app.reverse("courses"));
    }

    return res.code(400).send({ message: "Invalid _method" });
  });

  // DELETE: Eliminar curso (DELETE nativo para APIs)
  app.delete("/courses/:id", { name: "deleteCourse" }, (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM courses WHERE id = ?").run(parseInt(id));
    return res.redirect(app.reverse("courses"));
  });
};
