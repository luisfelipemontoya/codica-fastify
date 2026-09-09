import Database from "better-sqlite3";

// Crear base de datos en memoria
const db = new Database(":memory:");

// Inicializar tablas y datos semilla
const initializeDatabase = () => {
  // Crear tabla de cursos
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      duration INTEGER,
      tags TEXT
    );
  `);

  // Crear tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  // ✅ Insertar datos iniciales (cursos)
  const initialCourses = [
    { title: "JS: Arrays", description: "Curso sobre arrays en JavaScript", duration: 4, tags: "javascript,arrays,principiantes" },
    { title: "JS: Funciones", description: "Curso sobre funciones en JavaScript", duration: 6, tags: "javascript,funciones,intermedio" },
    { title: "JS: Objetos", description: "Curso sobre objetos en JavaScript", duration: 5, tags: null },
    { title: "CSS Grid", description: "Diseño moderno y responsive con CSS Grid Layout", duration: 3, tags: "css,grid,diseño" },
    { title: "HTML Semántico", description: "Estructura tu contenido con HTML5 semántico para mejor accesibilidad", duration: 2, tags: "html,accesibilidad,principiantes" }
  ];

  // ✅ DEFINIR insertCourse ANTES de usarlo
  const insertCourse = db.prepare(
    "INSERT INTO courses (title, description, duration, tags) VALUES (?, ?, ?, ?)"
  );

  initialCourses.forEach((course) => {
    insertCourse.run(course.title, course.description, course.duration, course.tags);
  });

  // ✅ Insertar datos iniciales (usuarios)
  const initialUsers = [
    { name: "Felipe Montoya", email: "felipe@example.com", password: "123456" },
    { name: "María González", email: "maria@example.com", password: "123456" },
    { name: "Carlos Pérez", email: "carlos@example.com", password: "123456" }
  ];

  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );

  initialUsers.forEach((user) => {
    insertUser.run(user.name, user.email, user.password);
  });
};

// Ejecutar inicialización
initializeDatabase();

export default db;