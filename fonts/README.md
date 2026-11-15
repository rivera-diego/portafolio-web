# Fuente del portafolio

`studio-mono-latin.woff2` conserva las formas de JetBrainsMono Nerd Font Mono y contiene el alfabeto latino, acentos, puntuación, flechas y caracteres de diagramas utilizados por el sitio. Se distribuye bajo `JetBrains-Mono-OFL.txt`.

Se generó desde el TTF incluido usando FontTools:

```sh
pyftsubset fonts/jetbrains-mono-nerd-font-mono-regular.ttf --output-file=fonts/studio-mono-latin.woff2 --flavor=woff2 --unicodes='U+0000-024F,U+0300-036F,U+2000-206F,U+2190-21FF,U+2500-257F' --layout-features='*'
```

Los iconos de interfaz son SVG; no requieren descargar el repertorio completo de glifos Nerd Font. Si se añaden otros idiomas o símbolos, ampliar este subconjunto.
