import yup from "yup";
import formbody from "@fastify/formbody"; 

//Datos temporales
const state = {
  courses: [
    {
      id: 1,
      title: "JS: Arrays",
      description: "Curso sobre arrays en JavaScript",
      duration: 4,
      tags: ["javascript", "arrays", "principiantes"]
    },
    {
      id: 2,
      title: "JS: Funciones",
      description: "Curso sobre funciones en JavaScript",
      duration: 6,
      tags: ["javascript", "funciones", "intermedio"]
    },
    {
      id: 3,
      title: "JS: Objetos",
      description: "Curso sobre objetos en JavaScript",
      duration: 5
    },
    { 
      id: 4, 
      title: "CSS Grid", 
      description: "Diseño moderno y responsive con CSS Grid Layout",
      duration: 3,
      tags: ["css", "grid", "diseño"]
    },
    { 
      id: 5, 
      title: "HTML Semántico", 
      description: "Estructura tu contenido con HTML5 semántico para mejor accesibilidad",
      duration: 2,
      tags: ["html", "accesibilidad", "principiantes"]
    }
  ]
};

export default async (app, opts) => {
  await app.register(formbody);

  // READ:Listar todos los cursos (GET /courses)
  app.get("/courses", { name: "courses" }, (req, res) => {
    const { term } = req.query; // Obtener parámetro de búsqueda
    let filteredCourses = state.courses;

    if (term) {
      // Filtrar por título O descripción (case insensitive)
      filteredCourses = state.courses.filter(course =>
        course.title.toLowerCase().includes(term.toLowerCase()) ||
        course.description.toLowerCase().includes(term.toLowerCase())        
      );
    }
    const data = {
      courses: filteredCourses,
      term: term || '', // Mantener el valor en el input
      header: "Cursos de programación",
      reverse: app.reverse
    };  
    
    res.view("src/views/courses/index", data);
  });

  //CREATE: Formulario para crear curso (GET /courses/new)
  app.get("/courses/new",  { name: "newCourse" }, (req, res) => {
    res.view("src/views/courses/new", { reverse: app.reverse });
  });

  //READ: Listar 1 curso específico (GET /courses/:id)
  app.get("/courses/:id", { name: "course" }, (req, res) => {
    const { id } = req.params;
    const course = state.courses.find(c => c.id === parseInt(id));

    if (!course) {
      return res.code(404).send({ message: "Course not found" });
    }

    res.view("src/views/courses/show", { 
      course, 
      reverse: app.reverse  
    });
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
      };
      return res.view("src/views/courses/new", data);
    }

    //Datos válidos: guardar curso
    const { title, description, duration } = req.body;

    const newCourse = {
      id: state.courses.length + 1,
      title: title.trim(),
      description: description.trim(),
      duration: parseInt(duration),
    };

    state.courses.push(newCourse);
    res.redirect(app.reverse("courses"));
  });

  // UPDATE: Formulario para editar curso (Añadir nueva funcionalidad -edit)
  app.get("/courses/:id/edit", { name: "editCourse" }, (req, res) => {
    const { id } = req.params;
    const course = state.courses.find(c => c.id === parseInt(id));

    if (!course) {
      return res.code(404).send({ message: "Course not found" });
    }

    res.view("src/views/courses/edit", { 
      course,
      reverse: app.reverse 
    });
  });

   // UPDATE: Actualizar curso (POST con _method)
  app.post("/courses/:id", { name: "updateCourse" }, (req, res) => {
    const { id } = req.params;
    const { _method, title, description, duration } = req.body;
    const courseIndex = state.courses.findIndex(c => c.id === parseInt(id));

    if (courseIndex === -1) {
      return res.code(404).send({ message: "Course not found" });
    }

    // Actualizar (PATCH via _method)
    if (_method === 'patch') {
      state.courses[courseIndex] = { 
        ...state.courses[courseIndex], 
        title: title.trim(), 
        description: description.trim(),
        duration: parseInt(duration)
      };
      return res.redirect(app.reverse("courses"));
    }

    // Eliminar (DELETE via _method)
    if (_method === 'delete') {
      state.courses.splice(courseIndex, 1);
      return res.redirect(app.reverse("courses"));
    }

    return res.code(400).send({ message: "Invalid _method" });
  });

  // DELETE: Eliminar curso (DELETE nativo para APIs)
  app.delete("/courses/:id", { name: "deleteCourse" }, (req, res) => {
    const { id } = req.params;
    const courseIndex = state.courses.findIndex(c => c.id === parseInt(id));

    if (courseIndex === -1) {
      return res.code(404).send({ message: "Course not found" });
    }

    state.courses.splice(courseIndex, 1);
    res.redirect(app.reverse("courses"));
  });

};
