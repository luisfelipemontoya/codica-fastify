import fp from "fastify-plugin";
import session from "@fastify/session";

export default fp(async (app, options) => {
  await app.register(session, {
    secret: process.env.SESSION_SECRET || 'una-clave-secreta-de-32-caracteres-minimo', // 32 caracteres mínimo
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos       
      httpOnly: true, 
      sameSite: 'lax', //Controla si las cookies se envían en solicitudes entre sitios (protección CSRF)
      path: '/',      
    }
  });
});