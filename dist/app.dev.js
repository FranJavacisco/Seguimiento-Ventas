"use strict";

var db;
var salesData = []; // Iniciar IndexedDB

function initDB() {
  var request = indexedDB.open("SalesDB", 1);

  request.onerror = function (event) {
    console.error("Error al abrir la base de datos", event);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    loadSalesData();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("sales", {
      keyPath: "id",
      autoIncrement: true
    });
  };
}

function loadSalesData() {
  var transaction = db.transaction(["sales"], "readonly");
  var objectStore = transaction.objectStore("sales");

  objectStore.getAll().onsuccess = function (event) {
    salesData = event.target.result || [];
  };
}

function formatNumber(input) {
  var value = input.value.replace(/\D/g, '');
  input.value = new Intl.NumberFormat('es-ES').format(value);
}

function discountIVA(amount) {
  return amount / 1.19;
}

function saveSale() {
  var saleAmount = parseFloat(document.getElementById("saleAmount").value.replace(/\./g, '')) || 0;
  var warrantyAmount = parseFloat(document.getElementById("warrantyAmount").value.replace(/\./g, '')) || 0;
  var insuranceAmount = parseFloat(document.getElementById("insuranceAmount").value.replace(/\./g, '')) || 0;
  var productDescription = document.getElementById("productDescription").value || "Sin descripción";
  var date = new Date();
  var dateString = "".concat(date.toLocaleDateString(), " ").concat(date.toLocaleTimeString());
  var saleRecord = {
    saleAmount: saleAmount,
    warrantyAmount: warrantyAmount,
    insuranceAmount: insuranceAmount,
    productDescription: productDescription,
    dateString: dateString
  };
  var transaction = db.transaction(["sales"], "readwrite");

  transaction.objectStore("sales").add(saleRecord).onsuccess = function () {
    salesData.push(saleRecord);
    updateIndicators(saleRecord);
    clearFields();
    alert("Venta guardada correctamente");
  };
}

function updateIndicators(record) {
  document.getElementById("ventaSinIVA").textContent = discountIVA(record.saleAmount).toFixed(2).toLocaleString('es-ES');
  document.getElementById("garantiaSinIVA").textContent = discountIVA(record.warrantyAmount).toFixed(2).toLocaleString('es-ES');
  document.getElementById("seguroSinIVA").textContent = discountIVA(record.insuranceAmount).toFixed(2).toLocaleString('es-ES');
  document.getElementById("crucePercent").textContent = ((record.warrantyAmount + record.insuranceAmount) / record.saleAmount * 100).toFixed(2) + "%";
}

function clearFields() {
  document.getElementById("saleAmount").value = '';
  document.getElementById("warrantyAmount").value = '';
  document.getElementById("insuranceAmount").value = '';
  document.getElementById("productDescription").value = '';
}

function downloadReport() {
  var transaction = db.transaction(["sales"], "readonly");
  var objectStore = transaction.objectStore("sales");

  objectStore.getAll().onsuccess = function (event) {
    var reportData = event.target.result.map(function (record) {
      return {
        Fecha: record.dateString,
        Descripción: record.productDescription,
        "Monto de Venta": record.saleAmount.toLocaleString('es-ES'),
        "Monto de Garantía": record.warrantyAmount.toLocaleString('es-ES'),
        "Monto de Seguro": record.insuranceAmount.toLocaleString('es-ES'),
        "Monto de Venta Neto (sin IVA)": discountIVA(record.saleAmount).toFixed(2).toLocaleString('es-ES'),
        "Monto de Garantía Neto (sin IVA)": discountIVA(record.warrantyAmount).toFixed(2).toLocaleString('es-ES'),
        "Monto de Seguro Neto (sin IVA)": discountIVA(record.insuranceAmount).toFixed(2).toLocaleString('es-ES'),
        "% Cruce": ((record.warrantyAmount + record.insuranceAmount) / record.saleAmount * 100).toFixed(2) + "%"
      };
    });
    var worksheet = XLSX.utils.json_to_sheet(reportData);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Ventas");
    XLSX.writeFile(workbook, "reporte_ventas.xlsx");
  };
}

initDB();

function guardarVenta(montoVenta, montoGarantia, montoSeguro, descripcion) {
  var fecha;
  return regeneratorRuntime.async(function guardarVenta$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          fecha = new Date();
          _context.next = 4;
          return regeneratorRuntime.awrap(db.collection("ventas").add({
            montoVenta: montoVenta,
            montoGarantia: montoGarantia,
            montoSeguro: montoSeguro,
            descripcion: descripcion,
            fecha: firebase.firestore.Timestamp.fromDate(fecha)
          }));

        case 4:
          console.log("Venta guardada exitosamente");
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error al guardar la venta: ", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function obtenerVentas() {
  var snapshot;
  return regeneratorRuntime.async(function obtenerVentas$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.collection("ventas").orderBy("fecha", "desc").get());

        case 3:
          snapshot = _context2.sent;
          snapshot.forEach(function (doc) {
            var venta = doc.data();
            console.log("Venta registrada:", venta); // Lógica para mostrar cada venta en el reporte
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error("Error al obtener las ventas: ", _context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}
//# sourceMappingURL=app.dev.js.map
