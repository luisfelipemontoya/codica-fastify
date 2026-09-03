export default async (app, opts) => {
  app.get('/', { name: "root" }, (req, res) => {
    res.view("src/views/index", { reverse: app.reverse } );
  });

  app.get("/about", { name: "about" }, (req, res) => {
    res.send("About this project");
  });
};
