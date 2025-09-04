# Aplicación de Favoritos de Rick y Morty

Aplicación web desarrollada con Vue.js 3 que permite a los usuarios registrarse, iniciar sesión y gestionar sus personajes favoritos de la serie Rick y Morty.

## 🚀 Características

- Registro y autenticación de usuarios
- Visualización de personajes de Rick y Morty
- Añadir/eliminar personajes a favoritos
- Interfaz responsiva y amigable
- Validación de formularios en tiempo real

## 🛠️ Requisitos Previos

- Node.js v22.18.0
- npm v10.9.3
- @vue/cli v5.0.9

### Versiones utilizadas en desarrollo:

```bash
node: v22.18.0
npm: v10.9.3
@vue/cli: v5.0.9
```

### Versiones mínimas requeridas:
- Node.js (versión 14.x o superior)
- npm (versión 6.x o superior) o yarn
- Vue CLI (opcional, pero recomendado)

## 🚀 Instalación

### Configuración Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/user-favorites-frontend.git
   cd user-favorites-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   VUE_APP_API_BASE_URL=http://localhost:8001
   VUE_APP_APP_NAME=User Favorites
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run serve
   # o
   yarn serve
   ```

5. Abre tu navegador en:
   ```
   http://localhost:8081
   ```

## 🔧 Variables de Entorno

| Variable                | Descripción                                   | Valor por defecto          |
|-------------------------|-----------------------------------------------|----------------------------|
| VUE_APP_API_BASE_URL   | URL base de la API de backend                 | http://localhost:8000/api  |
| VUE_APP_APP_NAME       | Nombre de la aplicación                      | User Favorites             |

## 👤 Usuario de Prueba

Puedes usar las siguientes credenciales para probar la aplicación:

- **Email:** test@example.com
- **Contraseña:** Password123@

## 🛠 Comandos Útiles

- **Iniciar servidor de desarrollo:** `npm run serve`
- **Compilar para producción:** `npm run build`
- **Linter:** `npm run lint`
- **Corregir problemas de estilo:** `npm run lint -- --fix`

## 📦 Dependencias Principales

- Vue.js 3
- Vue Router 4
- Vuex 4
- Axios
- Font Awesome

## 🎨 Estilos CSS

Este proyecto utiliza CSS normal (sin preprocesadores como SASS o LESS) por las siguientes razones:

- **Simplicidad**: Para mantener el proyecto ligero y fácil de mantener, se optó por CSS estándar.
- **Rendimiento**: Al no requerir compilación adicional, los estilos se cargan más rápido.
- **Compatibilidad**: CSS puro es universalmente compatible con todos los navegadores sin necesidad de configuraciones adicionales.
- **Mantenibilidad**: La estructura modular de los componentes Vue permite organizar los estilos de manera efectiva sin la complejidad añadida de preprocesadores.

Los estilos están organizados siguiendo la metodología BEM (Block Element Modifier) para mantener un código limpio y escalable.
