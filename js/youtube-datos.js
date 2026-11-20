// ============================================================================
//  SECCIÓN YOUTUBE · VERSIÓN MANUAL
//  Aquí escribes tú todo lo que sale en la sección: foto, nombre y los vídeos.
//  No usa ninguna clave ni se conecta a nada, salvo para enseñar el vídeo de YouTube.
//
//  Para añadir un vídeo, copia uno de los bloques de "videos" y cambia sus datos:
//     enlace       La dirección del vídeo tal cual la copias de YouTube
//                  (vale  https://www.youtube.com/watch?v=...  y  https://youtu.be/... ).
//     titulo       El título.
//     descripcion  La descripción (puedes usar varias líneas con `comillas invertidas`;
//                  las direcciones web se convierten en enlaces).
//     fecha        Día de subida, en formato  2026-11-18  (opcional; sale bajo el título).
//     miniatura    Opcional. Una imagen tuya para la portada. Si no la pones, se usa la de YouTube.
//
//  El PRIMER vídeo de la lista es el grande de arriba («Último vídeo»); los demás salen en «Más vídeos».
//  Si pones la fecha en todos, ya se ordenan solos del más nuevo al más antiguo.
//  Al pulsar cualquier vídeo de «Más vídeos» se abre ese vídeo en YouTube.
//  Usa vídeos normales, no shorts (los shorts son verticales y no encajan en la galería).
// ============================================================================
window.YOUTUBE = {
  canal: "https://www.youtube.com/@mcruzrod06",

  nombre: "Las creaciones de Marta",   // nombre que se ve junto a la foto
  avatar: "img/perfilcanalyt.jpg",             // tu foto de perfil de YouTube: guarda la imagen en la carpeta img y pon, por ejemplo, "img/perfil-youtube.jpg"

  maximo: 12,             // cuántos vídeos salen en «Más vídeos» (además del último)
  /* 
    {
      enlace: "",
      título: "",
      descripción: "",
      fecha: ""
    },
  */
  videos: [
    {
      enlace: "https://www.youtube.com/watch?v=0pthrhGPHPw",
      titulo: "¿Por qué has dejado de hacer las cosas que te gustaban?",
      descripcion: "Nos hemos acostumbrado a que todo ocurra demasiado rápido, incluso los momentos que deberían ser para disfrutar.",
      fecha: "7 nov 2026",
    },
    {
      enlace: "https://www.youtube.com/watch?v=HnWZ7OPFqGk",
      titulo: "Todos empezamos de cero.",
      descripcion: "El éxito no empieza cuando todos creen en ti, empieza cuando tú decides seguir aunque el resto todavía no crea.",
      fecha: "22 ago 2026"
    },
    {
      enlace: "https://www.youtube.com/watch?v=8fa0wMtDHTc",
      titulo: "¿Por qué dudas de ti?",
      descripcion: "A veces somos nosotros mismos los que frenamos nuestro potencial. Créete que mereces conseguir las cosas.",
      fecha: "1 jun 2026"
    },
    {
      enlace: "https://www.youtube.com/watch?v=pimP8ZGW0uU",
      titulo: "No eres lo que los demás te han hecho creer.",
      descripcion: "Está en tu mano rodearte de personas que te nutran y no que te apaguen.",
      fecha: "22 feb 2026"
    },
    {
      enlace: "https://www.youtube.com/watch?v=oN8cOW8x-zg",
      titulo: "Deja de vivir en lo que ya pasó.",
      descripcion: "Si alguna vez has sentido que el pasado te pesa más de lo que debería, este vídeo es para ti. Nunca es tarde para encontrar una solución.",
      fecha: "22 dic 2025"
    },
    {
      enlace: "https://www.youtube.com/watch?v=kZLcmUHejfA",
      titulo: "No seas borrego: deja de poner excusas",
      descripcion: "No te vendo nada en este vídeo, solo mi forma de pensar. Te invito a reflexionar conmigo.",
      fecha: "22 nov 2025"
    },
    {
      enlace: "https://www.youtube.com/watch?v=wTwHdFfI7Yw",
      titulo: "De adolescente invisible a la voz de toda una generación.",
      descripcion: "Si la Marta de 15 años pudiera verme ahora, seguro que estaría muy orgullosa de lo que hemos logrado. Gracias a todos los que me habéis apoyado en mi camino y en especial a los medios de comunicación tales como DiezTV Úbeda, RTVE y Cadena SER por sus inspiradoras palabras.",
      fecha: "23 jul 2025"
    },
    {
      enlace: "https://www.youtube.com/watch?v=5dOsm0ywXKs",
      titulo: "¿Cómo conectan las historias de Marta Cruz?",
      descripcion: "El pasado 28 de Marzo con motivo de la Feria del Libro de Mengíbar, tuve la oportunidad de explicar cómo mis historias no solo están conectadas entre sí, sino que también tienen la capacidad de conectar a las personas: Las historias tienen personajes y escenarios en común, pero también consiguen unir y animar a jóvenes interesados por la escritura, además de que gracias a sus temas complejos se motiva la comprensión entre jóvenes y adultos.",
      fecha: "11 jul 2025"
    },
    {
      enlace: "https://www.youtube.com/watch?v=lBrEaKJuj30",
      titulo: "Conoce a Marta Cruz en 10 preguntas",
      descripcion: `Con motivo del Día de la Mujer 2025, fui invitada junto a grandes mujeres exitosas a una charla-coloquio muy profunda y divertida en el Auditorio el Pósito de Linares.
      Las entrevistas que he tenido hasta ahora suelen preguntarme casi exclusivamente de mi libro, pero ese día sentí que buscaban conocerme a mí como persona. Echando la vista atrás, me siento orgullosa de mis palabras y me animo ahora a subirlo.`,
      fecha: "1 jul 2025"
    }
  ]
};
