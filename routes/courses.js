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

  // Listar todos los cursos (GET /courses)
  app.get("/courses", (req, res) => {
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
      header: "Cursos de programación"
    };  
    
    res.view("src/views/courses/index", data);
  });

  // Curso específico (GET /courses/:id)
  app.get("/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = state.courses.find(c => c.id === parseInt(id));

    if (!course) {
      return res.code(404).send({ message: "Course not found" });
    }

    res.view("src/views/courses/show", { course });
  });
};
