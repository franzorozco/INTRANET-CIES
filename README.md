# Intranet CIES

Solución de SharePoint Framework (SPFx) para la intranet CIES. El Web Part aloja una aplicación React con navegación interna, vistas y consulta de grupos de SharePoint mediante el cliente HTTP de SPFx.

## Requisitos para el equipo

- Node.js **22.x** (se recomienda **22.15.0**, la versión usada al crear la solución).
- npm, incluido con Node.js.
- Git para clonar el repositorio.
- Acceso a un tenant de SharePoint Online con permisos para usar el SharePoint Workbench y probar Web Parts.
- Un navegador moderno.

No es necesario instalar Heft ni las librerías del proyecto globalmente: npm las instala desde `package.json` y `package-lock.json`.

## Preparar el proyecto

1. Clonar el repositorio y entrar a la carpeta del proyecto:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd INTRANET-CIES
   ```

2. Instalar las dependencias declaradas y bloqueadas por el proyecto:

   ```bash
   npm ci
   ```

   Si se modifica `package.json` y se actualiza el archivo de bloqueo, usar `npm install` para actualizar las dependencias.

3. `config/serve.json` ya apunta al sitio de desarrollo `DevIntranet` y carga el manifiesto local desde `/temp/build/manifests.js`. Si trabajas con otro sitio, actualiza `initialPage` con su URL moderna y conserva los parámetros `loadSPFX` y `debugManifestsFile`. No se deben guardar contraseñas, tokens ni secretos en ese archivo.

## Desarrollo y compilación

Iniciar el servidor de desarrollo:

```bash
npm run start
```

Para compilar, ejecutar las validaciones del proyecto y empaquetar la solución:

```bash
npm run build
```

El paquete de SharePoint se genera en `sharepoint/solution/intranet.sppkg`. El comando `npm run clean` limpia los artefactos de compilación.

## Librerías principales

Estas dependencias se instalan automáticamente con `npm ci`; no hace falta ejecutar comandos `npm install <paquete>` por cada una:

- **SPFx 1.23.2** (`@microsoft/sp-*`): integración con SharePoint y ciclo de vida del Web Part.
- **React 17** y **React DOM**: interfaz de usuario.
- **Fluent UI React v9**, **Fluent UI React v8** y **Fluent UI Icons**: componentes, estilos e iconos.
- **React Router v6**: navegación entre vistas de la aplicación.
- **SPHttpClient** (`@microsoft/sp-http`): solicitudes autenticadas a SharePoint con el contexto del Web Part.
- **TypeScript 5.8**, **Heft** y herramientas SPFx: compilación, lint y empaquetado.

Las versiones exactas y el resto de dependencias están declaradas en `package.json`; `package-lock.json` permite que todos instalen el mismo árbol de paquetes con `npm ci`.

## Estructura del código

```text
src/
├── components/
│   ├── layout/       # Navegación y estructura compartida
│   ├── shared/       # Componentes reutilizables, como la protección de rutas
│   └── views/        # Páginas de la aplicación
├── constants/        # Valores compartidos, como el grupo de administración
├── services/         # Acceso a SharePoint mediante SPHttpClient
└── webparts/         # Punto de entrada SPFx
```

Las rutas y el layout principal se definen en `src/components/App.tsx`. Para agregar una página, crea su vista dentro de `src/components/views/` y registra su ruta en ese archivo. Si la página requiere permisos, usa `ProtectedRoute` y define el grupo en `src/constants/roles.ts`.

El contexto del Web Part se pasa a la aplicación React y se utiliza para realizar solicitudes autenticadas con `SPHttpClient`.
