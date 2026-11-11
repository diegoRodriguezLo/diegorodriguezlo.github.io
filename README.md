# Web Hnos. Rodríguez Gutiérrez

Sitio web estático, moderno, **mobile-first**, listo para **GitHub Pages**.

## Estructura

```
ghrmadrid/
├── index.html      # Página única (inicio, servicios, nosotros, trabajos, contacto)
├── style.css       # Estilos (mobile-first, responsive)
├── script.js       # Interactividad: menú móvil, galería dinámica, formulario
├── img/            # Carpeta para imágenes (vacía; añade tus fotos aquí)
└── README.md       # Este archivo
```

## Subir a GitHub Pages

1. Crea un repositorio público en GitHub, por ejemplo `ghrmadrid`.
2. Sube todos los archivos de la carpeta `ghrmadrid/` a la rama `main`.
3. En GitHub ve a **Settings → Pages**.
4. En "Build and deployment source" elige **Deploy from a branch**.
5. Selecciona la rama `main` y carpeta `/ (root)`. Guarda.
8. Espera unos minutos; tu web estará en `https://<usuario>.github.io/ghrmadrid/`.

## Formulario de contacto (dinámico)

El formulario usa el servicio gratuito **Formspree**

Cuando el usuario pulse "Enviar mensaje", el correo llegará a tu bandeja de Formspree.

## Personalizar

- **Colores**: edita las variables `:root` al inicio de `style.css`.
- **Teléfono / email / dirección**: están en `index.html` (sección contacto y footer).
- **Imágenes**: añade tus fotos en `img/` y sustitúyelas en `script.js` o `index.html`.

## Características

- ✅ Diseño mobile-first (prioriza móviles, se adapta a PC)
- ✅ Menú hamburguesa en móvil
- ✅ Galería de trabajos generada dinámicamente con JS
- ✅ Formulario de contacto con validación y estados de envío
- ✅ Llamada directa y email con un toque (tel: / mailto:)
- ✅ Sin dependencias externas (solo Google Fonts)
- ✅ Listo para subir tal cual a GitHub Pages
