# Un pequeño jardín para Manuela — versión 7

Regalo de cumpleaños interactivo hecho con HTML, CSS y JavaScript puro.

Incluye transiciones animadas, ambiente reactivo, pétalos, un jardín que despierta
al tocar la flor central, cuatro recuerdos que se despliegan en órbita, cinco
retos de gatos por rondas inspirados en el picnic, la salida a cine, Crepes y
los chistes compartidos, un rincón con tres actividades opcionales y una
celebración final acompañada por los cinco gatos.

La composición principal está optimizada para verla en un portátil. Antes de
despertar el jardín, las tarjetas, los gatos y el progreso permanecen ocultos.

La interfaz no utiliza emojis como ilustraciones: las flores, rosas, gatos, huella,
mariposas y objetos de los recuerdos están dibujados con SVG y CSS para mantener
un estilo visual coherente. No depende de fuentes remotas, servicios/APIs
externas, backend ni analítica. El único dato que guarda localmente es el
progreso del juego; el rincón no registra estados ni guarda mensajes. La
plantilla para pedir compañía usa el portapapeles nativo solo si la persona
pulsa el botón; nunca se envía.

## Abrir el proyecto

Puedes abrir `index.html` directamente en el navegador. Para trabajar con un servidor local:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000`.

## Publicar en GitHub Pages

En el repositorio, abre **Settings → Pages** y configura **Deploy from a branch**,
elige `main` y la carpeta `/(root)`, y pulsa **Save**. GitHub publicará el sitio
desde los archivos de esta carpeta cada vez que actualices `main`.

## Archivos

- `index.html`: estructura y textos principales.
- `styles.css`: diseño, responsive y animaciones.
- `script.js`: recuerdos, retos por rondas, actividades del rincón y progreso guardado.
- `favicon.svg`: icono de la flor.
- `social-preview.svg`: ilustración para la vista previa al compartir.
- `GOAL.md`: objetivo de cierre y lista de comprobación para publicar.
- `tests/smoke.test.mjs`: comprobaciones estáticas rápidas.

## Comprobar antes de compartir

Ejecuta las comprobaciones estáticas con:

```bash
node --test tests/smoke.test.mjs
node --check script.js
```

Después sigue la lista de portátiles en `GOAL.md`. Cuando conozcas la URL final
de GitHub Pages, añade esa URL absoluta a `og:image` para que WhatsApp pueda
mostrar la ilustración social. No compartas información que no quieras que sea
pública: un repositorio público y `noindex` no ofrecen privacidad.

Un audio de Dylan es opcional y solo se integra si él proporciona una grabación.
