# Control de Ventas Diario - Ripley

Esta aplicación de escritorio permite a los trabajadores de Ripley registrar y controlar sus ventas diarias. Ofrece una interfaz intuitiva y responsiva que facilita el ingreso y visualización de datos, así como la descarga de reportes para llevar un registro personal.

## Características

- **Registro de ventas**: Permite ingresar el monto de la venta, garantía y seguro con un separador de miles para facilidad de lectura.
- **Anulación de ventas**: Registra montos anulados de ventas, garantías y seguros.
- **Captación de montos**: Soporte para ingresar captaciones de TR, débito, avance y SAV.
- **Reportes detallados**:
  - Visualización de ventas con filtros diarios, semanales, mensuales y anuales.
  - Descarga en formato Excel, incluyendo el desglose de IVA y los totales.
- **Cálculo automático de IVA**: Los montos ingresados incluyen IVA, pero en el reporte se puede ver tanto el monto con IVA como el neto sin IVA.
- **Porcentaje de Cruce**: Cálculo que muestra el porcentaje de cruce (monto de garantía y seguro dividido por el monto de venta, multiplicado por 100).
- **Interfaz amigable**: Diseño simple con colores corporativos de Ripley (negro, amarillo y rojo), con casillas redondeadas y un estilo atractivo para mejorar la experiencia de usuario.

## Uso del Proyecto

1. **Ingreso de datos**: Completa los campos de ventas, anulaciones y captaciones. Todos los montos incluyen IVA.
2. **Visualización de reportes**: Selecciona el período deseado y revisa las ventas y montos relacionados.
3. **Descarga de reportes**: Haz clic en el botón de descarga para generar el reporte en Excel.
4. **Porcentaje de Cruce**: Verifica el cruce entre la venta y sus garantías y seguros para obtener una métrica de desempeño adicional.

## Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Control-Ventas-Ripley.git
