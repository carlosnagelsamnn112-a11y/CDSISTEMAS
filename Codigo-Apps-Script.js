/**
 * Pega ESTE archivo completo en Extensiones → Apps Script.
 * No cambies nada. Luego: Implementar → Nueva implementación → Aplicación web.
 */

var ENCABEZADOS = [
  'categoria', 'id', 'nombre', 'telefono', 'ciudad', 'departamento',
  'fuente', 'tipo', 'conocimientos', 'clientesSi', 'contacto', 'oferta',
  'propuesta', 'eligioAgenda', 'agendaComo', 'agendaTiempos',
  'eligioPrueba', 'pruebaComo', 'pruebaTiempos'
];

function hoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Datos') || ss.getSheets()[0];
  return sh;
}

function leerDatos() {
  var sh = hoja();
  var valores = sh.getDataRange().getDisplayValues();
  var vacio = { potenciales: [], clientes: [] };
  if (!valores || valores.length < 2) return vacio;

  var cab = valores[0].map(function (c) { return String(c).trim(); });
  var iCat = cab.indexOf('categoria');
  if (iCat === -1) return vacio;

  var out = { potenciales: [], clientes: [] };
  for (var f = 1; f < valores.length; f++) {
    var fila = valores[f];
    if (!fila.join('').trim()) continue;
    var cat = String(fila[iCat] || '').trim();
    if (cat !== 'potenciales' && cat !== 'clientes') continue;
    var rec = {};
    for (var c = 0; c < cab.length; c++) {
      if (!cab[c] || cab[c] === 'categoria') continue;
      rec[cab[c]] = fila[c];
    }
    out[cat].push(rec);
  }
  return out;
}

function escribirDatos(datos) {
  var sh = hoja();
  var filas = [ENCABEZADOS];
  ['potenciales', 'clientes'].forEach(function (cat) {
    var lista = (datos && datos[cat]) ? datos[cat] : [];
    lista.forEach(function (rec) {
      rec = rec || {};
      filas.push(ENCABEZADOS.map(function (campo) {
        if (campo === 'categoria') return cat;
        var v = rec[campo];
        return v == null ? '' : v;
      }));
    });
  });
  sh.clearContents();
  sh.getRange(1, 1, filas.length, ENCABEZADOS.length).setValues(filas);
  sh.setFrozenRows(1);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    return json(leerDatos());
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var cuerpo = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var datos = JSON.parse(cuerpo);
    escribirDatos(datos);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
