# Español e inglés

El portafolio se publica como HTML estático en dos idiomas. El español conserva sus direcciones y el inglés usa `/en/`. No se descarga un traductor ni se cambia el contenido mediante JavaScript.

## Editar y regenerar

1. Editar las páginas españolas.
2. Añadir o actualizar la traducción de cada texto en `i18n/en.json`. Los nombres propios, tecnologías y fragmentos de código pueden conservar el mismo valor.
3. Para cambios en el cotizador, mantener también `i18n/services-script.en.json`.
4. Ejecutar `python3 tools/build_english.py` desde la raíz del repositorio.
5. Incluir los HTML españoles, los archivos generados en `en/`, `js/services.en.js` y el sitemap en el commit.

El generador usa únicamente la biblioteca estándar de Python. Se detiene ante textos nuevos sin entrada en el diccionario para evitar publicar traducciones incompletas. Las páginas inglesas y `js/services.en.js` son archivos generados; no editarlos directamente. Las anotaciones de idioma y el selector se regeneran sin duplicarse.

El selector ES / EN es un par de enlaces accesibles, mantiene el proyecto actual y conserva la sección cuando JavaScript está disponible. La dirección elegida determina el idioma durante la navegación. No hay redirecciones automáticas basadas en ubicación o idioma del navegador.

Cada pareja tiene `hreflang` recíproco, `x-default` hacia español y una URL canónica propia. El sitemap incluye los dos idiomas. La propiedad de dominio de Search Console y los DNS existentes siguen siendo válidos; no hace falta una propiedad adicional para `/en/`.

La portada, perfil, CV, índice de proyectos, cuatro casos de estudio y Servicios tienen versión inglesa. Las demos de clientes conservan su contenido original; sus enlaces se identifican como contenido en español. Los importes siguen expresados en soles peruanos (S/), sin conversión monetaria.
