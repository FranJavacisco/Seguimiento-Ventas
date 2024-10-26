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
//# sourceMappingURL=app.dev.js.map
