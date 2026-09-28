# Objetivo de cierre — Regalo para Manuela

## Objetivo

Entregar antes del 30 de septiembre una experiencia web estática, bonita y
reutilizable que se sienta hecha por Dylan para Manuela: amistosa y cariñosa,
con recuerdos reales, humor, interacciones claras y un pequeño rincón al que
ella pueda volver cuando quiera.

El recorrido completo apunta a unos 20 minutos si se exploran los recuerdos y
los retos sin afán; no debe imponer esperas ni un temporizador. La duración real
queda pendiente de medirse durante la prueba manual. Si se siente corto, solo se
amplía con detalles reales que Dylan aporte, nunca con recuerdos inventados o
relleno.

## Límites del regalo

- Mantener el tono de amigo a amiga; no prometer una relación ni un futuro juntos.
- No introducir recuerdos, canciones, conversaciones, fotografías ni voz que
  Dylan no haya proporcionado expresamente.
- No guardar información sobre cómo se siente Manuela ni sobre sus elecciones
  en el rincón de apoyo.
- No incluir datos íntimos o material privado innecesario.
- Mantener la página en HTML, CSS y JavaScript sin backend ni servicios de pago.

## Criterios para considerar terminada la página

- La portada conserva la flor y el jardín empieza dormido; al tocar la flor,
  los recuerdos aparecen sin solaparse en portátil.
- Los cuatro recuerdos están basados en hechos compartidos; cada gato tiene un
  reto distinto de varias rondas relacionado con un recuerdo o con el jardín.
- El rincón ofrece una pausa visual que se puede detener/repetir, una plantilla
  que solo se copia si la visitante lo pide y una búsqueda de luciérnagas. No
  guarda elecciones, temporizadores ni mensajes.
- Al completar el recorrido, los cinco gatos acompañan visualmente el mensaje
  final de cumpleaños.
- El mensaje final sigue siendo cálido, amistoso y sin promesas de pareja.
- No hay emojis como ilustraciones, dependencias de fuentes remotas, solicitudes
  a APIs ni seguimiento analítico.
- Controles ocultos no reciben foco de teclado; hay foco visible, texto para
  JavaScript desactivado y respeto por movimiento reducido.
- El progreso del juego sobrevive una recarga; datos dañados o almacenamiento
  bloqueado no rompen la página.
- La prueba manual mide si el recorrido pausado se acerca a 20 minutos; no se
  alarga artificialmente para cumplir una cifra.
- Las pruebas estáticas pasan y la lista manual de portátiles se completa antes
  de compartir el enlace.

## Lista manual de publicación

- Revisar en 1366×768 y 1440×900, zoom del navegador al 100 % y 125 %.
- Revisar que en pantallas estrechas las tarjetas pasen a una cuadrícula clara,
  sin tapar la flor ni salirse de la pantalla.
- Probar desde cero en una ventana privada: portada → flor → cuatro recuerdos
  → cinco retos → mensaje final → volver al jardín.
- Recorrerla sin afán y estimar la duración; si hace falta más contenido, pedir
  recuerdos concretos a Dylan antes de añadirlos.
- Probar las rondas de los cinco gatos; confirmar pistas, reinicios y cierre.
- Probar la pausa: empezar, detener, continuar, reiniciar y salir; confirmar que
  no queda ningún temporizador activo al cerrar el rincón.
- Probar la plantilla del mensaje: copiar no debe enviarlo ni guardarlo.
- Encontrar las cinco luciérnagas, repetir el juego y confirmar que el progreso
  del rincón no se conserva.
- Comprobar la vista previa después de publicar. La URL final de GitHub Pages
  aún debe añadirse como `og:image` absoluto para que WhatsApp pueda cargar la
  ilustración `social-preview.svg` de forma fiable.
- Recordar que GitHub Pages sirve el contenido públicamente; `noindex` no es
  una contraseña ni convierte el repositorio en privado.

## Material opcional pendiente

Un audio personal solo se añade si Dylan graba y entrega el archivo. No se debe
generar una voz sintética ni publicar audio por defecto. Si no hay grabación,
la página está completa sin esa mejora.
