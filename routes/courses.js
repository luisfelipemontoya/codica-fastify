const state = {
  courses: [
    {
      id: 1,
      title: "JS: Arrays",
      description: "Curso sobre arrays en JavaScript",
      duration: 4
    },
    {
      id: 2,
      title: "JS: Funciones",
      description: "Curso sobre funciones en JavaScript",
      duration: 6
    },
    {
      id: 3,
      title: "JS: Objetos",
      description: "Curso sobre objetos en JavaScript",
      duration: 5
    }
  ]
};

export default async (app, opts) => {

  // Listar todos los cursos (GET /courses)
  app.get("/courses", (req, res) => {
    const data = {
      courses: state.courses,
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
