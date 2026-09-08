export default async (app, opts) => {
  app.get('/', { name: "root" }, (req, res) => {   
    // 1. Leer cookie de visita
    const visited = req.cookies?.visited === 'true';

    //2.  Establecer cookie SOLO si es primera visita
    if (!visited) {   
      res.cookie('visited', 'true', {
          maxAge: 60 * 60 * 24 * 30,
          httpOnly: true,
          path: '/'
        });
    }
    
      //3. pasar datos a la plantilla
    const data ={
      visited: visited || false,
      userId: req.session?.userId || null,
      userName: req.session?.userName || null,
      reverse: app.reverse      
    };

    return res.view("src/views/index", data);
  });

  app.get("/about", { name: "about" }, (req, res) => {
    return res.send("About this project");
  });
};
