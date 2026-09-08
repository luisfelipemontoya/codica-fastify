import fp from "fastify-plugin";
import session from "@fastify/session";

export default fp(async (app, options) => {
  await app.register(session, {
    secret: 'una-clave-secreta-de-32-caracteres-minimo', // 32 caracteres mínimo
    cookie: {
      secure: false, // true en producción con HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos       
      httpOnly: true, 
      sameSite: 'lax', //Controla si las cookies se envían en solicitudes entre sitios (protección CSRF)
      path: '/',      
    }
  });
});