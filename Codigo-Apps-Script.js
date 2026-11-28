/**
 * Base de datos de "Estrategia comercial" (Base.html) en Google Sheets.
 *
 * Cómo actualizar:
 *   1. Pega ESTE archivo completo en Extensiones → Apps Script (reemplaza el anterior).
 *   2. Implementar → Gestionar implementaciones → lápiz (editar) →
 *      Versión: "Nueva versión" → Implementar.
 *      Así la URL /exec de sheets-config.js NO cambia.
 *
 * Qué responde:
 *   GET  → { ok, version, inicializada, potenciales: [...], clientes: [...] }
 *   POST → { accion: 'guardar', categoria, registro }  crea o actualiza UNA fila (por id)
 *          { accion: 'eliminar', id }                  borra UNA fila (copia en "Eliminados")
 *
 * Ya NO existe ninguna acción que reescriba toda la hoja: un envío vacío,
 * incompleto o de una versión vieja de la página se rechaza sin tocar datos.
 */

var VERSION = 3;
var NOMBRE_HOJA = 'Datos';
var CATEGORIAS = ['potenciales', 'clientes'];
var ESTADOS = ['pendiente', 'enviado'];
var ENCABEZADOS = [
  'categoria', 'id', 'nombre', 'telefono', 'ciudad', 'departamento',
  'fuente', 'tipo', 'conocimientos', 'clientesSi', 'contacto',
  'propuesta', 'estado', 'enviado', 'creado', 'actualizado'
];
/* estado  = 'pendiente' | 'enviado'
   enviado = fecha ISO en que se marcó como enviado ('' si está pendiente).
   Columnas antiguas (oferta, enviados, agenda, prueba...) que ya no usa la
   página: si existen en la hoja se conservan tal cual, no se borran. */
var NOMBRE_PAPELERA = 'Eliminados';
var MAX_TEXTO = 5000;

/* ============================================================
   HOJA Y CABECERA
============================================================ */
function hoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(NOMBRE_HOJA) || ss.getSheets()[0];
}

function leerCabecera(sh) {
  var n = sh.getLastColumn();
  if (!n) return [];
  return sh.getRange(1, 1, 1, n).getDisplayValues()[0]
    .map(function (c) { return String(c).trim(); });
}

/* Asegura que existan todas las columnas. Las que falten se añaden al
   final sin mover las existentes (ni columnas propias que agregues). */
function cabeceraCompleta(sh) {
  var cab = leerCabecera(sh);
  if (!cab.join('')) cab = [];
  var faltan = ENCABEZADOS.filter(function (c) { return cab.indexOf(c) === -1; });
  if (faltan.length) {
    var desde = cab.length + 1;
    var hasta = desde + faltan.length - 1;
    if (hasta > sh.getMaxColumns()) {
      sh.insertColumnsAfter(sh.getMaxColumns(), hasta - sh.getMaxColumns());
    }
    sh.getRange(1, desde, 1, faltan.length).setValues([faltan]);
    cab = cab.concat(faltan);
  }
  if (sh.getFrozenRows() !== 1) sh.setFrozenRows(1);
  return cab;
}

function asegurarFilas(sh, ultimaFila) {
  var faltan = ultimaFila - sh.getMaxRows();
  if (faltan > 0) sh.insertRowsAfter(sh.getMaxRows(), faltan);
}

/* Texto seguro para la celda: evita que Sheets lo convierta en fórmula,
   número o fecha (teléfonos con +57, que empiezan por 0, textos con =). */
function celda(v) {
  if (v == null) return '';
  if (typeof v === 'object' && !(v instanceof Date)) v = JSON.stringify(v);
  var s = String(v).slice(0, MAX_TEXTO);
  return /^[=+\-@0-9.]/.test(s) ? "'" + s : s;
}

/* ============================================================
   LECTURA
============================================================ */
function leerDatos() {
  var sh = hoja();
  var out = { ok: true, version: VERSION, inicializada: false, potenciales: [], clientes: [] };
  var valores = sh.getDataRange().getDisplayValues();
  if (!valores.length) return out;

  var cab = valores[0].map(function (c) { return String(c).trim(); });
  var iCat = cab.indexOf('categoria');
  if (iCat === -1) return out;
  out.inicializada = true;

  for (var f = 1; f < valores.length; f++) {
    var fila = valores[f];
    if (!fila.join('').trim()) continue;
    var cat = String(fila[iCat] || '').trim();
    if (CATEGORIAS.indexOf(cat) === -1) continue;
    var rec = {};
    for (var c = 0; c < cab.length; c++) {
      if (!cab[c] || cab[c] === 'categoria') continue;
      rec[cab[c]] = fila[c];
    }
    out[cat].push(rec);
  }
  return out;
}

function buscarFila(sh, cab, id) {
  var iId = cab.indexOf('id');
  var total = sh.getLastRow() - 1;
  if (iId === -1 || total < 1) return -1;
  var ids = sh.getRange(2, iId + 1, total, 1).getDisplayValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === id) return i + 2;
  }
  return -1;
}

/* ============================================================
   ESCRITURA
============================================================ */
function validarCategoria(c) {
  if (CATEGORIAS.indexOf(c) === -1) throw new Error('Categoría no válida');
}

function validarId(id) {
  var s = String(id == null ? '' : id).trim();
  if (!s || s.length > 100) throw new Error('Id no válido');
  return s;
}

/* Un registro debe traer al menos nombre y teléfono: así una petición
   incompleta nunca deja filas vacías ni pisa una fila buena con blancos. */
function validarRegistro(rec) {
  if (!rec || typeof rec !== 'object') throw new Error('Registro vacío');
  if (!String(rec.nombre || '').trim()) throw new Error('Falta el nombre');
  if (!String(rec.telefono || '').trim()) throw new Error('Falta el teléfono');
  rec.estado = ESTADOS.indexOf(rec.estado) === -1 ? 'pendiente' : rec.estado;
  if (rec.estado === 'pendiente') rec.enviado = '';
}

/* previa = { valores, formulas } de la fila existente, o null si es nueva.
   Las columnas propias (que no están en ENCABEZADOS) se conservan. */
function armarFila(cab, categoria, rec, previa) {
  return cab.map(function (campo, i) {
    if (campo === 'categoria') return categoria;
    if (ENCABEZADOS.indexOf(campo) !== -1) {
      var v = rec[campo];
      if ((v == null || v === '') && campo === 'creado' && previa) v = previa.valores[i];
      return celda(v);
    }
    if (!previa) return '';
    if (previa.formulas[i]) return previa.formulas[i];
    var actual = previa.valores[i];
    return typeof actual === 'string' ? celda(actual) : actual;
  });
}

function guardarRegistro(categoria, rec) {
  validarCategoria(categoria);
  validarRegistro(rec);
  rec.id = validarId(rec.id);

  var sh = hoja();
  var cab = cabeceraCompleta(sh);
  rec.actualizado = new Date().toISOString();

  var f = buscarFila(sh, cab, rec.id);
  var previa = null;
  if (f === -1) {
    f = sh.getLastRow() + 1;
    asegurarFilas(sh, f);
    if (!rec.creado) rec.creado = rec.actualizado;
  } else {
    var r = sh.getRange(f, 1, 1, cab.length);
    previa = { valores: r.getValues()[0], formulas: r.getFormulas()[0] };
  }
  sh.getRange(f, 1, 1, cab.length).setValues([armarFila(cab, categoria, rec, previa)]);
  return { ok: true, id: rec.id, actualizado: rec.actualizado };
}

/* Antes de borrar, la fila se copia a la hoja "Eliminados" con la fecha,
   para poder recuperarla a mano si se borró por error. */
function copiarAPapelera(sh, cab, f) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pap = ss.getSheetByName(NOMBRE_PAPELERA) || ss.insertSheet(NOMBRE_PAPELERA);
  var cabPap = ['eliminado'].concat(cab);
  if (!leerCabecera(pap).join('')) {
    pap.getRange(1, 1, 1, cabPap.length).setValues([cabPap]);
    pap.setFrozenRows(1);
  }
  var valores = sh.getRange(f, 1, 1, cab.length).getDisplayValues()[0].map(celda);
  pap.appendRow([celda(new Date().toISOString())].concat(valores));
}

function eliminarRegistro(id) {
  id = validarId(id);
  var sh = hoja();
  var cab = leerCabecera(sh);
  var f = buscarFila(sh, cab, id);
  if (f !== -1) {
    copiarAPapelera(sh, cab, f);
    // Sheets no deja borrar la única fila sin congelar: en ese caso se vacía.
    if (sh.getMaxRows() - sh.getFrozenRows() <= 1) {
      sh.getRange(f, 1, 1, sh.getLastColumn()).clearContent();
    } else {
      sh.deleteRow(f);
    }
  }
  return { ok: true, encontrado: f !== -1 };
}

/* ============================================================
   ENTRADAS WEB
============================================================ */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function conBloqueo(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return json({ ok: false, error: 'Hoja ocupada, intenta de nuevo', reintentar: true });
  }
  try {
    return json(fn());
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return conBloqueo(leerDatos);
}

function doPost(e) {
  return conBloqueo(function () {
    var cuerpo = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!cuerpo) throw new Error('Petición vacía');
    var p = JSON.parse(cuerpo) || {};
    switch (p.accion) {
      case 'guardar':  return guardarRegistro(p.categoria, p.registro);
      case 'eliminar': return eliminarRegistro(p.id);
      default:         throw new Error('Acción no reconocida');
    }
  });
}
