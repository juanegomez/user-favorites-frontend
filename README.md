# Aplicación de Favoritos

Una aplicación web moderna construida con Vue 3, Vite, Vue Router y Vuex que permite a los usuarios explorar personajes de la API de Rick and Morty, marcarlos como favoritos y gestionar su lista de favoritos.

## 🚀 Características

- 🔍 Explora personajes de la API de Rick and Morty
- ⭐ Marca/Desmarca personajes como favoritos
- 📱 Diseño responsivo para todos los tamaños de pantalla
- 🔒 Autenticación de usuarios (inicio de sesión/registro)
- 📱 Soporte PWA (Aplicación Web Progresiva)
- 🎨 Interfaz de usuario moderna con animaciones fluidas
- ⚡ Construida con Vite para un desarrollo y producción rápidos

## 🛠️ Tecnologías Utilizadas

- **Framework Frontend**: Vue 3 (Composition API)
- **Herramienta de Construcción**: Vite
- **Gestión de Estado**: Vuex 4
- **Enrutamiento**: Vue Router 4
- **Cliente HTTP**: Axios
- **Estilos**: SCSS con Variables CSS
- **Iconos**: Font Awesome
- **Linting**: ESLint + Prettier
- **Pruebas**: Vitest + Vue Test Utils

## 📦 Requisitos Previos

- Node.js (versión 16.0.0 o superior)
- npm (versión 8.0.0 o superior) o yarn
- Git

## 🚀 Comenzando

### 1. Clona el repositorio

```bash
git clone https://github.com/yourusername/user-favorites-frontend.git
cd user-favorites-frontend
```

### 2. Instala las dependencias

```bash
npm install
# o
yarn
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en el directorio raíz y agrega las siguientes variables:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Favoritos de Usuario"
VITE_APP_ENV=development
VITE_AUTH_TOKEN_KEY=token
VITE_AUTH_USER_KEY=user
```

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en http://localhost:3000

## 🏗️ Estructura del Proyecto

```
src/
├── assets/            # Archivos estáticos (imágenes, fuentes, etc.)
├── components/        # Componentes Vue reutilizables
├── router/            # Configuración de Vue Router
├── store/             # Módulos de Vuex
├── styles/            # Estilos globales y variables SCSS
├── views/             # Componentes de página
├── App.vue            # Componente raíz de Vue
└── main.js            # Punto de entrada de la aplicación
```

## 🏗️ Construcción para Producción

```bash
# Construir para producción
npm run build

# Vista previa de la construcción de producción localmente
npm run preview
```

## 🧑‍💻 Flujo de Desarrollo

- `npm run dev` - Inicia el servidor de desarrollo con recarga en caliente
- `npm run lint` - Ejecuta el linter y corrige archivos
- `npm run format` - Formatea el código con Prettier
- `npm run type-check` - Verificación de tipos en archivos TypeScript
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de la construcción de producción

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
