export default async (app, opts) => {
  app.get('/', { name: "root" }, (req, res) => {   
    // 1. Leer cookie de visita
    const visited = req.cookies?.visited === 'true';

    //2.  Establecer cookie para futuras visitas (30días)
      res.cookie('visited', 'true', {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        path: '/'
      });
    
      //3. pasar datos a la plantilla
    const data ={
      visited: visited || false,
      reverse: app.reverse
    };

    res.view("src/views/index", { 
      visited: visited,
      reverse: app.reverse } );
  });

  app.get("/about", { name: "about" }, (req, res) => {
    res.send("About this project");
  });
};
