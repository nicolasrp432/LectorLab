# Comprobaciones de LectorLab · Peter y producto piloto

## Verificado en esta edición

- Sintaxis de los módulos JavaScript y compilación de producción con Vite.
- Pruebas existentes del cuaderno: cambio de rutas, notas independientes, siete días, progreso, exportación, guardado opcional, recuperación y borrado con cancelación.
- Revisión visual en navegador a 1363 px y en marcos de 390 y 320 px (anchos de contenido de 375 y 305 px al descontar la barra de desplazamiento).
- Peter visible en portada con transparencia; el wordmark LectorLab permanece. Segunda pose cargada como guía del cuaderno.
- Cambio Peter/libro: estado visual y accesible actualizado; fallback ilustrado visible sin WebGL.
- Nuevos botones Con Peter / Libro 3D: 44 px de alto. CTA principal móvil: 54 px. Sin recortes en titulares, botones, oferta ni cuaderno a los anchos revisados.
- Apertura del temario del kit y acceso al cuaderno desde la oferta.
- En navegador móvil: escribir una nota, marcar el día, pasar al siguiente y volver conserva la respuesta y muestra 1 de 7 días completados. Guardado persistente desactivado durante QA.
- Pausa manual: contenido visible y navegación sin desplazamiento suave obligatorio.
- PDF de 31 páginas: renderizado completo y revisión visual de todas las páginas en contacto, con revisión ampliada de ejercicios. 21 sesiones presentes y numeradas, fuentes incrustadas, hojas sin texto cortado.
- Activos nuevos WebP con alpha real; 132 y 119 KiB aproximadamente.

## Contraste calculado

| Texto / fondo | Ratio |
| --- | --- |
| Tinta / papel | 16,85:1 |
| Tinta / lima | 16,29:1 |
| Tinta / rojo | 4,98:1 |
| Secundario claro / tinta | 10,65:1 |

Estos pares superan 4,5:1. La comprobación no equivale a una auditoría completa WCAG.

## Límites de la revisión

WebGL está desactivado en el navegador de pruebas: el renderizado y la apertura reales de la escena Three.js no pudieron verificarse aquí. Sí se verificó el fallback CSS y que la interfaz no queda bloqueada. El módulo se carga solo al pedir la vista del libro.

No se han realizado pruebas con usuarios, auditoría completa de accesibilidad, medición de conversión, test de compra/entrega o prueba de rentabilidad. No hay checkout. El PDF es imprimible y admite anotación mediante aplicaciones compatibles; no contiene campos AcroForm.

La maquetación responsive se revisó en un navegador remoto y marcos estrechos, no en un dispositivo físico. Quedan por ampliar las pruebas de zoom 200 %, lectores de pantalla y dispositivos con WebGL activo.
