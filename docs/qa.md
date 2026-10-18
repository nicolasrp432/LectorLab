# Comprobaciones de la landing

## Superadas

- Sintaxis de los tres módulos JavaScript.
- Compilación de producción con Vite.
- Estructura HTML: anidamiento, IDs únicos, anclas, panel de pestañas e imágenes con texto alternativo.
- Simulación de las interacciones del cuaderno: cambio de ruta, notas independientes, siete días, progreso, exportación, guardado opcional, recuperación y borrado con cancelación.
- Contraste calculado para los pares principales:

| Texto / fondo | Ratio |
| --- | --- |
| Tinta / papel | 16,85:1 |
| Tinta / lima | 16,29:1 |
| Tinta / rojo | 4,98:1 |
| Texto secundario / papel | 6,67:1 |
| Texto secundario claro / tinta | 10,65:1 |

Todos superan 4,5:1. Los textos decorativos grandes y los estados deshabilitados no se presentan como una auditoría completa WCAG.

## Adaptación prevista en código

- Menú compacto y portada en una columna en móvil.
- Controles principales de al menos 44 px.
- Sin secciones fijadas por scroll por debajo de 1024 px.
- Fuentes locales, imagen WebP y módulo Three.js separado.
- Alternativa visual sin WebGL y sin movimiento obligatorio.
- Pausa manual y soporte de `prefers-reduced-motion`.

## Pendiente de comprobar en navegador real

La conexión al navegador local ha fallado y el navegador alternativo ha bloqueado la URL del servidor de previsualización. No se ha completado una inspección visual de escritorio/móvil ni una medición real de rendimiento o accesibilidad.

Revisar al abrir el proyecto: 320, 375, 768, 1024 y 1440 px; móvil horizontal; zoom al 200 %; navegación por teclado; movimiento reducido; apertura/cierre del libro; alternancia de animaciones y exportación del cuaderno. Estos casos no deben considerarse aprobados solo por las pruebas simuladas.
