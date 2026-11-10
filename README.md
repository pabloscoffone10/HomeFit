# HomeFit

HomeFit es una aplicación gratuita de escritorio para Windows que ayuda a organizar entrenamientos personalizados en casa. Permite crear perfiles, adaptar rutinas al objetivo, nivel, equipamiento, disponibilidad y restricciones de muñecas, registrar sesiones y consultar el progreso.

## Características

- Onboarding y perfiles con preferencias de entrenamiento.
- Rutinas personalizadas según objetivo, nivel y equipamiento.
- Catálogo de ejercicios con instrucciones y demostraciones oficiales de YouTube.
- Entrenamiento guiado con preparación, series, descansos, avance y resumen.
- Calendario, historial, estadísticas e hidratación.
- Persistencia local en el equipo del usuario.
- Fallback de instrucciones y enlace externo si un video no puede incrustarse.

La aplicación no incluye capturas de pantalla en el repositorio actualmente.

## Descargar e instalar en Windows

Descargá `HomeFit-Setup-1.0.0.exe` desde la sección **Releases** de GitHub y ejecutalo. Windows puede mostrar una advertencia porque el instalador no está firmado digitalmente; verificá que el archivo provenga de la Release oficial del repositorio.

Los videos de demostración requieren conexión a Internet porque se reproducen desde YouTube. El resto de los datos del perfil, rutinas e historial se guarda localmente.

## Desarrollo

Requisitos:

- Windows 10 u 11 de 64 bits para la aplicación empaquetada.
- Node.js compatible con el proyecto y npm.

Instalar dependencias:

```bash
npm ci
```

Ejecutar Vite y Electron en desarrollo:

```bash
npm run dev
```

Generar la build web y los archivos de Electron:

```bash
npm run build
```

Generar el instalador Windows:

```bash
npm run dist
```

El instalador se genera en `release/`. Las carpetas `dist/`, `dist-electron/` y `release*/` son salidas generadas y están excluidas de Git.

## Tecnologías

React, TypeScript, Vite, Electron, Electron Builder, Lucide React y el reproductor oficial incrustado de YouTube.

## Privacidad y seguridad

HomeFit guarda la información de perfiles, sesiones, calendario e historial mediante almacenamiento local del dispositivo. No se incluyen tokens ni credenciales en el proyecto. Los videos se cargan desde YouTube y están sujetos a sus propias políticas y disponibilidad.

HomeFit no sustituye el asesoramiento médico, fisioterapéutico ni de un profesional del entrenamiento. Consultá a un profesional antes de comenzar si tenés dolor, lesiones o una condición médica.

## Licencia

El código de HomeFit se distribuye bajo la licencia MIT. Las marcas, servicios y videos de terceros conservan sus respectivas condiciones. HomeFit no descarga ni redistribuye videos de YouTube.
