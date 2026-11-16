# Identidad visual de Diego Rivera

La implementación vigente está en `css/author.css`, `js/author.js` y las páginas HTML. Este documento es una referencia de mantenimiento; no requiere ningún plugin.

## Dirección visual

Un estudio personal de software: fondo carbón, texto marfil, detalles cobre, tipografía de terminal e imágenes con textura tramada. Las referencias visuales son [Omarchy](https://omarchy.org/) y [Ryoku](https://ryoku.dev/): cuidado tipográfico, espacio, imágenes protagonistas e interacción con el puntero. La composición y la ilustración son propias.

La portada sigue cuatro bloques: presentación, perfil y enfoque, proyectos seleccionados y contacto. El nombre es el titular principal. Servicios tiene acceso secundario y conserva sus herramientas. Las demos mantienen sus identidades.

## Color

| Variable | Valor | Uso |
| --- | --- | --- |
| `--paper` | `#10110f` | Fondo |
| `--surface` | `#191b17` | Diagramas y superficies |
| `--ink` | `#e8e3d5` | Texto principal |
| `--soft` | `#c1beb2` | Párrafos secundarios |
| `--muted` | `#96998b` | Metadatos |
| `--accent` | `#c89b6e` | Acciones, foco y detalles |
| `--line` | `#45483f` | Contornos |
| `--line-soft` | `#2a2d26` | Separadores discretos |

## Tipografía y escala

- Títulos, navegación, botones y datos: **JetBrainsMono Nerd Font Mono**, alojada localmente como `Studio Mono`, peso 400. Se carga un subconjunto latino de 46 KB en lugar del repertorio completo de aproximadamente 1 MB; véase `fonts/README.md`. Licencia incluida en `fonts/`.
- Párrafos: fuente sans del sistema, 16–18 px, interlineado 1.7–1.85 y ancho de lectura limitado.
- Solo el nombre de portada tiene escala excepcional: 66–102 px en escritorio y 58–86 px en móvil.
- Títulos interiores: 32–50 px; secciones: 25–34 px; títulos de proyecto: 17–25 px según contexto.
- Navegación y controles: 11–14 px. Los rótulos pequeños de las imágenes son decorativos; no contienen información necesaria para operar la web.

## Composición

Contenedor máximo de 1240 px. Márgenes laterales de 40 px en escritorio, 24 px en tableta y 20 px en móvil. Portada de dos columnas que se apila por debajo de 700 px; proyectos seleccionados en tres columnas, una en móvil. Separación de secciones de 50–88 px. Bordes finos y superficies planas, sin sombras luminosas.

Las páginas de proyectos, perfil, casos de estudio y CV comparten cabecera, tipografía, controles y colores. Los casos mantienen una columna de lectura y un índice lateral en escritorio. El CV tiene una hoja de estilos de impresión clara.

## Imágenes

La pieza protagonista es una geometría 3D de un nudo toroidal (2,3), renderizada con WebGL nativo en `js/sculpture.js`. Está formada por diez cintas independientes, cada una con una sección metálica cerrada y aplanada, espesor visible, biseles y pequeñas irregularidades en sus cantos. Cada cinta tiene 250 segmentos longitudinales y 24 alrededor de su sección; no existe un tubo continuo bajo ellas. Las microperforaciones se recortan tanto en la pasada visible como en el mapa de sombras: permiten ver las superficies posteriores. La pátina, el grano fino y las líneas de grabado acompañan al material durante su recorrido. Los bordes tienen acentos de cobre sobre acero cálido envejecido.

La iluminación usa sombras proyectadas por las propias cintas mediante un mapa de profundidad de 1024 px y nueve muestras. Las perforaciones visibles se suavizan con derivadas y cobertura de muestras cuando el navegador las admite. El acabado recrea el concepto de la imagen original; su geometría y renderizado no son una copia exacta. Mantiene una orientación fija: el material de las cintas recorre el nudo mientras ondas de torsión y contracción deforman su superficie. Las normales se recalculan en el shader para que la luz acompañe la deformación. El nombre de la pieza es **Continuidad**; es una ilustración de identidad, independiente de la pequeña marca de píxeles de la cabecera. El antiguo rótulo «FIG. 01» se retiró.

La geometría reconstruye el concepto de la ilustración original y no pretende reproducir exactamente la imagen generada. `img/sculpture-poster.webp` muestra un fotograma inicial del propio modelo cuando no hay JavaScript, WebGL no está disponible o se pierde el contexto gráfico. Esto evita cambiar entre dos geometrías al comenzar la animación. La imagen generada original se conserva en `img/systems-loop.webp`. El PNG y `img/systems-loop.json` conservan el original y su procedencia.

Referencia de geometría: [nudos toroidales, MathWorld](https://mathworld.wolfram.com/TorusKnot.html). Referencia de implementación: [animación con WebGL, MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_objects_with_WebGL).

Los visuales de proyectos son diagramas SVG conceptuales, identificados como tales. El índice de proyectos usa dos columnas en escritorio y una en móvil, con descripción breve, estado, tres tecnologías principales y enlaces. Los detalles técnicos siguen en los casos de estudio; los experimentos secundarios se agrupan en un desplegable nativo. No sustituyen capturas reales del producto. El retrato existente se presenta en escala de grises.

## Efectos y accesibilidad

- Un campo de píxeles cobre responde al ratón sobre la portada: proximidad, desplazamiento y retorno suave. El canvas deja de dibujar cuando se estabiliza o sale de pantalla.
- Las cintas recorren el nudo en unos 23 segundos, con ondulaciones locales y sin giro global de la figura. Se dibuja a un máximo de 30 fotogramas por segundo y densidad de píxeles limitada a 1.5. Se detiene fuera de pantalla, cuando la pestaña se oculta o se activa la pausa. En dispositivos táctiles también fluye; con movimiento reducido muestra una posición fija. La imagen de respaldo mantiene una inclinación leve con el ratón.
- Trazos animados al pasar por los proyectos; no hay carruseles automáticos ni contenido dependiente del scroll.
- El control de animaciones del pie de página guarda la preferencia local. Se respeta `prefers-reduced-motion`; en táctil el campo es estático.
- El cursor nativo permanece visible. Los enlaces tienen foco visible; el menú móvil admite Escape y devuelve el foco. Sin JavaScript, el contenido y la navegación siguen disponibles.

## Criterios para cambios futuros

Conservar la jerarquía entre nombre, proyectos y perfil. Añadir imágenes con intención y evitar convertir cada párrafo en una tarjeta. Usar la mono para identidad y orientación, y la sans para lectura. No presentar intereses en DevOps e IA como experiencia profesional acreditada ni inventar métricas, capturas o publicaciones.

## Navegación y carga

El sitio mantiene HTML, CSS y JavaScript, con enlaces normales entre documentos. Las transiciones nativas entre documentos se activan como mejora progresiva en navegadores compatibles. La cabecera tiene una representación propia durante la transición y el contenido cambia mediante un fundido de 160 ms. Se conserva el comportamiento normal de enlaces, historial, fragmentos y apertura en otra pestaña. Con movimiento reducido se omite la transición; la preferencia de pausa guardada también desactiva sus animaciones.

El fondo y la preferencia de movimiento se establecen antes del primer renderizado. El control de pausa está presente en el HTML con espacio reservado y el indicador de página actual no cambia la altura de los enlaces. La entrada desenfocada de la portada se retiró. El retrato usa WebP con dimensiones explícitas.

La escultura empieza durante un momento libre del navegador. En móvil o con cuatro núcleos lógicos o menos utiliza 160 segmentos, sombras de 768 px, densidad máxima de 1 y hasta 24 fps; en escritorio usa 250 segmentos, sombras de 1024 px, densidad máxima de 1.5 y hasta 30 fps. Con ahorro de datos conserva el fotograma estático. Se mantienen la pausa y la detención fuera de pantalla.

Astro puede ser útil en una futura reorganización para compartir plantillas y publicar artículos; no es un requisito para resolver los saltos actuales. React se reservaría para herramientas con interacción y estado más complejos.

## Idiomas

La cabecera incluye Inicio, Proyectos, Sobre mí, CV y Contacto, con la página activa señalada. Contacto tiene una página propia en `/contacto/` y `/en/contact/`; la navegación no vuelve a la portada para desplazarse. El idioma se muestra como un único enlace de texto al idioma alternativo (EN o ES), separado de la navegación por una línea discreta en escritorio. El control de animaciones está en el pie con texto explícito. El encabezado se adapta hasta 320 px sin desplazar el nombre ni el menú móvil. El cambio lleva a la misma página en el otro idioma y conserva el fragmento de sección si está presente. Los nombres accesibles del menú, la pausa y los anuncios de filtros siguen el idioma de la página.

Las versiones inglesas se generan mediante `tools/build_english.py` y los diccionarios revisados de `i18n/`. Consultar `i18n/README.md` antes de editar contenido. Las demos de clientes conservan su idioma original y están identificadas como tales.

## Contacto e iconos

Contacto combina una introducción con retrato, un panel de correo prioritario y tres canales: WhatsApp, LinkedIn y GitHub. Las redes adicionales conservan acceso secundario. Los iconos lineales se comparten desde `img/contact-icons.svg`, con `currentColor`, sin dependencias externas. Se usan también en portada, CV, perfil, Servicios y los pies de página. Los iconos decorativos están ocultos a lectores de pantalla; los enlaces conservan texto o un nombre accesible. El botón de copiar correo aparece solo si el navegador admite el portapapeles y anuncia el resultado sin abrir aplicaciones externas.

La rejilla de Contacto declara áreas para introducción, correo y redes. Introducción y correo se alinean arriba en escritorio; a 900 px o menos se apilan. Las columnas usan `minmax(0, 1fr)` para no forzar el ancho por el contenido.

Los recursos CSS, JS y el archivo de iconos llevan una versión de contenido generada con `tools/build_english.py`. La publicación responde con hasta cuatro horas de caché para CSS: reutilizar una URL sin versión mezclaba el HTML nuevo de Contacto con la rejilla anterior y desarmaba las tarjetas. Se comprobó que las URLs versionadas cargan los estilos vigentes aun conservando la caché anterior.
