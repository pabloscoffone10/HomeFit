# Reporte de videos demostrativos — HomeFit

Fecha de auditoría: 2026-11-10

## Resultado ejecutivo

La reproducción de los 20 videos fue confirmada en el renderer Chromium cuando la aplicación se sirve mediante HTTP local. No pude confirmar visualmente la reproducción dentro del ejecutable Electron empaquetado porque el controlador de interfaz nativa no estuvo disponible en este entorno; por eso no se declara que los 20 funcionen en la aplicación instalada.

El Error 153 sí se reprodujo en la versión que cargaba la aplicación mediante `file://`: YouTube no recibía un origen HTTP válido. La corrección actual sirve `dist` desde un servidor HTTP local y pasa el `origin` real al reproductor oficial. Se eliminó el `Referer` falsificado. El Error 152-4 no volvió a reproducirse y no se pudo atribuir a un ID concreto.

## Clasificación real

| Estado | Cantidad | Detalle |
|---|---:|---|
| URL válida y reproducción confirmada en Chromium HTTP | 20 | Se cargó cada iframe y se pulsó Play en `http://localhost:4173` |
| Reproducción confirmada dentro de Electron empaquetado | 0 declarados | Sin control visual nativo disponible para comprobarla |
| Reproducción bloqueada en la prueba HTTP | 0 | No apareció Error 101, 150, 152-4 ni 153 durante la prueba |
| Video no disponible | 0 | No se detectó uno en esta auditoría |

## Videos probados

| Ejercicio | ID de YouTube | Resultado Chromium HTTP |
|---|---|---|
| sentadilla | `OOsb9DNs8dI` | Play confirmado |
| zancada | `g8-Ge9S0aUw` | Play confirmado |
| puente-gluteo | `SKOMwg1JLrU` | Play confirmado |
| peso-muerto | `aa57T45iFSE` | Play confirmado |
| elevacion-talones | `Km0QS46bTEA` | Play confirmado |
| flexiones | `WDIpL0pjun0` | Play confirmado |
| press-hombros | `MMjBnEBnZKM` | Play confirmado |
| remo | `DmUX88nWClo` | Play confirmado |
| plancha | `mwlp75MS6Rg` | Play confirmado |
| dead-bug | `bxn9FBrt4-A` | Play confirmado |
| bird-dog | `ZdAHe9_HeEw` | Play confirmado |
| mountain-climber | `ZhiCSdOVJp0` | Play confirmado |
| jumping-jacks | `uLVt6u15L98` | Play confirmado |
| burpee | `Ny8JWqh4lNg` | Play confirmado |
| abduccion-cadera | `g9FtnmsIYgI` | Play confirmado |
| estiramiento-gato-vaca | `1Y0YjXS9sKI` | Play confirmado |
| rotacion-toracica | `C8wzQhlXPx8` | Play confirmado |
| curl-biceps | `XE_pHwbst04` | Play confirmado |
| extension-triceps | `nRiJVZDpdL0` | Play confirmado |
| superman | `J9zXkxUAfUA` | Play confirmado; controles y reproducción observados manualmente |

La prueba no se basó solamente en HTTP 200 u oEmbed: cada iframe se cargó en Chromium, se localizó el botón de reproducción y se verificó que el reproductor mostrara el estado de reproducción. El resultado es válido para ese renderer HTTP y no sustituye la prueba visual del ejecutable instalado.

## Corrección aplicada

- [electron/main.cjs](C:/Users/Administrator/Desktop/entreno/electron/main.cjs) sirve la build empaquetada desde `http://127.0.0.1:<puerto>` en vez de `file://` y elimina el hook que falsificaba `Referer`.
- [src/InteractiveTraining.tsx](C:/Users/Administrator/Desktop/entreno/src/InteractiveTraining.tsx) usa el reproductor oficial con `enablejsapi=1` y el origen HTTP real, escucha errores del IFrame Player API y activa un fallback después de un tiempo prudente sin `onReady`.
- El fallback conserva las instrucciones, permite pulsar «Entendí — Empezar» y ofrece «Ver demostración en YouTube».
- El botón externo usa IPC y `shell.openExternal`; solo acepta `https:` y hosts oficiales `youtube.com`, `www.youtube.com` y `youtu.be`.
- No se usan proxies, descargas, cookies falsificadas ni orígenes falsificados.

## Otras verificaciones funcionales

Se revisaron onboarding y persistencia de datos, perfiles de prueba con objetivos/equipamiento/disponibilidad diferentes, rutinas distintas, correspondencia de calendario con días elegidos, flujo de entrenamiento y filtro de muñecas. La persistencia se comprobó en el renderer web mediante recarga. La persistencia después de cerrar y reabrir el ejecutable Electron no pudo observarse visualmente en este entorno.

## Pendiente explícito

Falta una comprobación visual final dentro de un Electron empaquetado ejecutándose en Windows. El instalador generado queda disponible para esa prueba manual; hasta realizarla, la clasificación correcta de los 20 videos en Electron instalado es «no confirmada», aunque los 20 reproducen en el renderer Chromium HTTP usado para la auditoría.

