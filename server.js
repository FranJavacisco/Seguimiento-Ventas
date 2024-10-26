const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const app = express();
const PORT = 3000;

// Configuración de la base de datos SQLite
const db = new sqlite3.Database('./ventas.db');
db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saleAmount INTEGER,
        warrantyAmount INTEGER,
        insuranceAmount INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Middleware para manejar JSON
app.use(express.json());
app.use(express.static('.'));

// Ruta para guardar una venta
app.post('/save', (req, res) => {
    const { saleAmount, warrantyAmount, insuranceAmount } = req.body;
    db.run(
        `INSERT INTO ventas (saleAmount, warrantyAmount, insuranceAmount) VALUES (?, ?, ?)`,
        [saleAmount, warrantyAmount, insuranceAmount],
        function (err) {
            if (err) return res.status(500).json({ message: "Error al guardar la venta" });
            res.json({ message: "Venta guardada correctamente" });
        }
    );
});

// Ruta para descargar el reporte en Excel
app.get('/download', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Monto de Venta', key: 'saleAmount', width: 15 },
        { header: 'Monto de Garantía', key: 'warrantyAmount', width: 15 },
        { header: 'Monto de Seguro', key: 'insuranceAmount', width: 15 },
        { header: 'Fecha', key: 'date', width: 20 }
    ];

    db.all(`SELECT * FROM ventas`, [], (err, rows) => {
        if (err) return res.status(500).send("Error generando reporte");

        rows.forEach(row => worksheet.addRow(row));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_ventas.xlsx"');
        workbook.xlsx.write(res).then(() => res.end());
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
